import {Arch, Distro, TemplateListFragment} from "../../generated-models";
import React from "react";
import {faRedhat, faSuse, faUbuntu} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import InstallOptions = TemplateListFragment.InstallOptions;


export function installOptionsFormatter(cell: InstallOptions) {
  if (!cell)
    return;
  let icon = null;
  switch (cell.distro) {
    case Distro.Debian:
      icon = faUbuntu;
      break;
    case Distro.CentOs:
      icon = faRedhat;
      break;
    case Distro.Suse:
      icon = faSuse;
      break;

  }
  let arch = " (architecture is not set)";
  switch (cell.arch) {
    case Arch.I386:
      arch = " 32-bit";
      break;
    case Arch.X86_64:
      arch = " 64-bit";
      break;
  }

  return (<span>
    <FontAwesomeIcon icon={icon}/>
    {cell.release && (<b> {cell.release}</b>)}
    {arch}
    {cell.installRepository && (<span> (install from {cell.installRepository}) </span>)
    || " (installation repository is not set)"}
  </span>)
}
