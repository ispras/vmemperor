
# TODO Repeat for all Xen classes
def get_type_by_string(str):
    if str == "VM":
        from xenadapter import VM
        return VM
    elif str == "Template":
        from xenadapter import  Template
        return Template
    elif str == "Network":
        from xenadapter import Network
        return Network

