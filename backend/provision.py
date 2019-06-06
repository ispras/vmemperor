#!/usr/bin/env python
# Copyright (c) 2007 XenSource, Inc.
#
# Permission to use, copy, modify, and distribute this software for any
# purpose with or without fee is hereby granted, provided that the above
# copyright notice and this permission notice appear in all copies.
#
# THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
# WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
# MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
# ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
# WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
# ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
# OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

# Parse/regenerate the "disk provisioning" XML contained within templates
# NB this provisioning XML refers to disks which should be created when
# a VM is installed from this template. It does not apply to templates
# which have been created from real VMs -- they have their own disks.

import XenAPI
import xml.dom.minidom

class Disk:
    """Represents a disk which should be created for this VM"""
    def __init__(self, device : str =None, size : str =None, sr : str =None, bootable : bool =None, element=None):
        if element:
            self.device = element.getAttribute("device")
            self.size = element.getAttribute("size")
            self.sr = element.getAttribute("sr")
            self.bootable = element.getAttribute("bootable") == "true"
        else:
            if not any((device, size, sr, bootable)):
                raise ValueError("specify either Element or all of device, size, sr, bootable")
            self.device = device # 0, 1, 2, ...
            self.size = size     # in bytes
            self.sr = sr         # uuid of SR
            self.bootable = bootable

    def toElement(self, doc : xml.dom.minidom.Document):
        disk = doc.createElement("disk")
        disk.setAttribute("device", self.device)
        disk.setAttribute("size", self.size)
        disk.setAttribute("sr", self.sr)
        b = "false"
        if self.bootable: b = "true"
        disk.setAttribute("bootable", b)
        return disk


class ProvisionSpec:
    """Represents a provisioning specification: currently a list of required disks"""

    def toElement(self, doc : xml.dom.minidom.Document):
        element = doc.createElement("provision")
        for disk in self.disks:
            element.appendChild(disk.toElement(doc))
        return element
    def setSR(self, sr):
        """Set the requested SR for each disk"""
        for disk in self.disks:
            disk.sr = sr
    def setDiskSize(self, size):
        (self.disks)[0].size = size

    def __str__(self):
        doc = xml.dom.minidom.Document()
        doc.appendChild(self.toElement(doc))
        return doc.toprettyxml()

    def __init__(self, spec=None):
        self.disks = []
        if spec:
            doc = xml.dom.minidom.parseString(txt)
            all = doc.getElementsByTagName("provision")
            if len(all) != 1:
                raise "Expected to find exactly one <provision> element"
            disks = all[0].getElementsByTagName("disk")
            for disk in disks:
                self.disks.append(Disk(disk))




def getProvisionSpec(session, vm):
    """Read the provision spec of a template/VM"""
    other_config = session.xenapi.VM.get_other_config(vm)
    return ProvisionSpec(spec=other_config['disks'])

def setProvisionSpec(session, vm, ps):
    """Set the provision spec of a template/VM"""
    txt = str(ps)
    try:
        session.xenapi.VM.remove_from_other_config(vm, "disks")
    except:
        pass
    session.xenapi.VM.add_to_other_config(vm, "disks", txt)

if __name__ == "__main__":
    print ("Unit test of provision XML spec module")
    print ("--------------------------------------")
    ps = ProvisionSpec()
    ps.disks.append(Disk("0", "1024", "0000-0000", True))
    ps.disks.append(Disk("1", "2048", "1111-1111", False))
    print ("* Pretty-printing spec")
    txt = str(ps)
    print (txt)
    print ("* Re-parsing output")
    ps2 = ProvisionSpec(txt)
    print ("* Pretty-printing spec")
    txt2 = str(ps)
    print (txt2)
    if txt != txt2:
        raise "Sanity-check failed: print(parse(print(x))) <> print(x)"
    print ("* OK: print(parse(print(x))) == print(x)")