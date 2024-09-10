//

import { type GetModerationByIdHandler } from "@~/moderations.repository";
import { join_organization } from "@~/moncomptepro.lib";
import { forceJoinOrganization } from "@~/moncomptepro.lib/sdk";
import { type GetMemberHandler } from "@~/users.repository";
import { to as await_to } from "await-to-js";

//

export function MemberJoinOrganization({
  get_member,
  get_moderation_by_id,
}: {
  get_member: GetMemberHandler;
  get_moderation_by_id: GetModerationByIdHandler;
}) {
  return async function member_join_organization({
    moderation_id,
    is_external,
  }: {
    moderation_id: number;
    is_external: boolean;
  }) {
    const { organization_id, user_id } = await get_moderation_by_id(
      moderation_id,
      {
        columns: {
          organization_id: true,
          user_id: true,
        },
      },
    );

    const [get_member_err] = await await_to(
      get_member(
        { organization_id, user_id },
        { columns: { updated_at: true } },
      ),
    );

    if (get_member_err) {
      await forceJoinOrganization({
        is_external,
        organization_id,
        user_id,
      });
    }

    // NOTE(dougladuteil): still run legacy endpoint
    await join_organization({
      is_external,
      organization_id,
      user_id,
    });
  };
}
