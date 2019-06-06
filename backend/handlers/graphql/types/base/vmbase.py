from enum import auto

import graphene
from serflag import SerFlag

from handlers.graphql.types.access import create_access_type


class VMActions(SerFlag):
    attach_vdi = auto()
    attach_network = auto()
    rename = auto()
    change_domain_type = auto()
    VNC = auto()
    launch_playbook = auto()

    changing_VCPUs = auto()
    changing_memory_limits = auto()
    snapshot = auto()
    clone = auto()
    copy = auto()
    create_template = auto()
    revert = auto()
    checkpoint = auto()
    snapshot_with_quiesce = auto()
    #provision = auto()
    start = auto()
    start_on = auto()
    pause = auto()
    unpause = auto()
    clean_shutdown = auto()
    clean_reboot = auto()
    hard_shutdown = auto()
    power_state_reset = auto()
    hard_reboot = auto()
    suspend = auto()
    csvm = auto()
    resume = auto()
    resume_on = auto()
    pool_migrate = auto()
    migrate_send = auto()
    shutdown = auto()
    destroy = auto()


GVMActions = graphene.Enum.from_enum(VMActions)
GVMAccessEntry = create_access_type("GVMAccessEntry", GVMActions)