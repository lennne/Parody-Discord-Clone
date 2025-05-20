"use client"

import { ServerWithMembersWithProfiles } from "@/types";
import { ChannelType, MemberRole } from "@prisma/client";
import { ActionToolTip } from "../action-tooltip";
import { Plus } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ServerSectionProps {
    label: string,
    role?: MemberRole,
    sectionType: "channels" | "members",
    channelType?: ChannelType,
    server?: ServerWithMembersWithProfiles
}
const ServerSection = ({label, role, sectionType, channelType, server} : ServerSectionProps) => {
    const { onOpen } = useModal();
    return (
        <div className="flex items-center justify-between py-2">
            <p className="text-xs uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                {label}
            </p>
            <ActionToolTip label="Create Channel" side="top">
                {role !== MemberRole.GUEST && sectionType === "channels" && (
                   <button onClick={() => onOpen("createChannel")} className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 dark:hover:text-zinc-300 transition">
                    <Plus className="h-4 w-4"/>
                   </button>
                )}
            </ActionToolTip>
        </div>
    )
}

export default ServerSection;