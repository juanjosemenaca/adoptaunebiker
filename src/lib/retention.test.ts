import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  decideAcceptedSignup,
  decideInactiveMember,
  decideRejectedSignup,
  monthsAgo,
  planRetentionPurge,
  summarizeRetentionPlan,
} from "./retention.ts";

const now = new Date("2026-10-21T12:00:00.000Z");

describe("rejected signup retention", () => {
  it("does not purge a rejection newer than six months", () => {
    const decision = decideRejectedSignup(
      {
        id: "recent-rejected",
        createdAt: "2026-09-01T00:00:00.000Z",
        inboxStatus: "rejected",
        status: "rejected",
        rejectedAt: "2026-09-01T00:00:00.000Z",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.reason, "rejected_too_recent");
  });

  it("purges a rejection older than six months", () => {
    const decision = decideRejectedSignup(
      {
        id: "old-rejected",
        createdAt: "2025-01-01T00:00:00.000Z",
        inboxStatus: "rejected",
        status: "rejected",
        rejectedAt: "2026-01-01T00:00:00.000Z",
      },
      now,
    );
    assert.equal(decision.purge, true);
    assert.equal(decision.reason, "rejected_older_than_six_months");
  });

  it("keeps pending requests even if they are old", () => {
    const decision = decideRejectedSignup(
      {
        id: "old-pending",
        createdAt: "2025-01-01T00:00:00.000Z",
        inboxStatus: "in_analysis",
        status: "pending",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.reason, "pending_kept");
  });

  it("does not invent an abandoned category for unread requests", () => {
    const decision = decideRejectedSignup(
      {
        id: "unread",
        createdAt: "2025-01-01T00:00:00.000Z",
        inboxStatus: "unread",
        status: "pending",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.reason, "pending_kept");
  });

  it("keeps accepted requests after the member profile was created", () => {
    const decision = decideRejectedSignup(
      {
        id: "accepted",
        createdAt: "2025-01-01T00:00:00.000Z",
        inboxStatus: "accepted",
        status: "approved",
        rejectedAt: "2025-01-02T00:00:00.000Z",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.reason, "accepted_kept");
  });

  it("does not purge a rejected row without rejected_at", () => {
    const decision = decideRejectedSignup(
      {
        id: "no-stamp",
        createdAt: "2025-01-01T00:00:00.000Z",
        inboxStatus: "rejected",
        status: "rejected",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.reason, "rejected_at_missing");
  });

  it("keeps a rejected row under a legal hold", () => {
    const decision = decideRejectedSignup(
      {
        id: "held",
        createdAt: "2025-01-01T00:00:00.000Z",
        inboxStatus: "rejected",
        status: "rejected",
        rejectedAt: "2025-01-01T00:00:00.000Z",
        retentionHold: true,
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.reason, "retention_hold");
  });

  it("keeps a row if inbox is accepted even when status is rejected", () => {
    const decision = decideRejectedSignup(
      {
        id: "accepted-wins",
        createdAt: "2025-01-01T00:00:00.000Z",
        inboxStatus: "accepted",
        status: "rejected",
        rejectedAt: "2025-01-01T00:00:00.000Z",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.reason, "accepted_kept");
  });

  it("keeps a row if status is approved even when inbox is rejected", () => {
    const decision = decideRejectedSignup(
      {
        id: "approved-wins",
        createdAt: "2025-01-01T00:00:00.000Z",
        inboxStatus: "rejected",
        status: "approved",
        rejectedAt: "2025-01-01T00:00:00.000Z",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.reason, "accepted_kept");
  });

  it("treats inbox rejected with pending status as a rejection", () => {
    const decision = decideRejectedSignup(
      {
        id: "inbox-only-rejected",
        createdAt: "2025-01-01T00:00:00.000Z",
        inboxStatus: "rejected",
        status: "pending",
        rejectedAt: "2026-01-01T00:00:00.000Z",
      },
      now,
    );
    assert.equal(decision.purge, true);
    assert.equal(decision.reason, "rejected_older_than_six_months");
  });

  it("purges a rejection exactly six calendar months old", () => {
    const decision = decideRejectedSignup(
      {
        id: "exactly-six-months",
        createdAt: "2026-04-21T12:00:00.000Z",
        inboxStatus: "rejected",
        status: "rejected",
        rejectedAt: "2026-04-21T12:00:00.000Z",
      },
      now,
    );
    assert.equal(decision.purge, true);
    assert.equal(decision.reason, "rejected_older_than_six_months");
  });
});

describe("inactive member retention", () => {
  it("never purges an active member", () => {
    const decision = decideInactiveMember(
      {
        id: "active-member",
        kind: "user",
        memberStatus: "active",
        deactivatedAt: "2025-01-01T00:00:00.000Z",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.reason, "active_kept");
  });

  it("never purges an admin, even if inactive and the last one", () => {
    const decision = decideInactiveMember(
      {
        id: "admin",
        kind: "admin",
        memberStatus: "inactive",
        deactivatedAt: "2025-01-01T00:00:00.000Z",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.reason, "admin_kept");
  });

  it("does not purge a recent deactivation", () => {
    const decision = decideInactiveMember(
      {
        id: "recent-inactive",
        kind: "user",
        memberStatus: "inactive",
        deactivatedAt: "2026-09-01T00:00:00.000Z",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.reason, "inactive_too_recent");
  });

  it("purges an inactive member after six months", () => {
    const decision = decideInactiveMember(
      {
        id: "old-inactive",
        kind: "user",
        memberStatus: "inactive",
        deactivatedAt: "2026-01-01T00:00:00.000Z",
      },
      now,
    );
    assert.equal(decision.purge, true);
    assert.equal(decision.reason, "inactive_older_than_six_months");
  });

  it("does not treat created_at as a deactivation date", () => {
    const decision = decideInactiveMember(
      {
        id: "no-deactivated-at",
        kind: "user",
        memberStatus: "inactive",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.reason, "deactivated_at_missing");
  });

  it("keeps an inactive member under a legal hold", () => {
    const decision = decideInactiveMember(
      {
        id: "held-member",
        kind: "user",
        memberStatus: "inactive",
        deactivatedAt: "2025-01-01T00:00:00.000Z",
        retentionHold: true,
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.reason, "retention_hold");
  });

  it("purges an inactive member exactly six calendar months old", () => {
    const decision = decideInactiveMember(
      {
        id: "exactly-six-months-member",
        kind: "user",
        memberStatus: "inactive",
        deactivatedAt: "2026-04-21T12:00:00.000Z",
      },
      now,
    );
    assert.equal(decision.purge, true);
    assert.equal(decision.reason, "inactive_older_than_six_months");
  });
});

describe("retention horizon calendar edge", () => {
  it("clamps 31-day months like PostgreSQL interval months", () => {
    const from = new Date("2026-08-31T12:00:00.000Z");
    const horizon = monthsAgo(from, 6);
    assert.equal(horizon.toISOString(), "2026-02-28T12:00:00.000Z");
  });
});

describe("retention plan", () => {
  it("selects only the expired rejected request and expired inactive member", () => {
    const plan = planRetentionPurge(
      {
        signups: [
          {
            id: "keep-pending",
            createdAt: "2025-01-01T00:00:00.000Z",
            inboxStatus: "read",
            status: "pending",
          },
          {
            id: "keep-accepted",
            createdAt: "2025-01-01T00:00:00.000Z",
            inboxStatus: "accepted",
            status: "approved",
            acceptedMemberId: "keep-active",
          },
          {
            id: "keep-recent",
            createdAt: "2026-09-01T00:00:00.000Z",
            inboxStatus: "rejected",
            status: "rejected",
            rejectedAt: "2026-09-01T00:00:00.000Z",
          },
          {
            id: "purge-rejected",
            createdAt: "2025-01-01T00:00:00.000Z",
            inboxStatus: "rejected",
            status: "rejected",
            rejectedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
        members: [
          { id: "keep-active", kind: "user", memberStatus: "active" },
          {
            id: "keep-admin",
            kind: "admin",
            memberStatus: "inactive",
            deactivatedAt: "2025-01-01T00:00:00.000Z",
          },
          {
            id: "keep-other-member",
            kind: "user",
            memberStatus: "inactive",
            deactivatedAt: "2026-09-01T00:00:00.000Z",
          },
          {
            id: "purge-member",
            kind: "user",
            memberStatus: "inactive",
            deactivatedAt: "2026-01-01T00:00:00.000Z",
          },
        ],
      },
      now,
    );

    assert.deepEqual(plan.purgeSignupIds, ["purge-rejected"]);
    assert.deepEqual(plan.purgeMemberIds, ["purge-member"]);
    assert.equal(plan.dryRun, true);
    assert.deepEqual(summarizeRetentionPlan(plan), {
      dryRun: true,
      horizon: "2026-04-21T12:00:00.000Z",
      rejectedWouldDelete: 1,
      membersWouldDelete: 1,
      acceptedWouldAnonymize: 0,
      rejectedKept: 3,
      membersKept: 3,
    });
  });
});

describe("accepted signup minimization", () => {
  it("keeps a linked accepted request while the member exists", () => {
    const decision = decideAcceptedSignup(
      {
        id: "linked",
        createdAt: "2025-01-01T00:00:00.000Z",
        inboxStatus: "accepted",
        status: "approved",
        acceptedMemberId: "member-1",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.anonymize, false);
    assert.equal(decision.reason, "accepted_linked_kept");
  });

  it("does not anonymize a recent orphan accepted request", () => {
    const decision = decideAcceptedSignup(
      {
        id: "recent-orphan",
        createdAt: "2026-09-01T00:00:00.000Z",
        inboxStatus: "accepted",
        status: "approved",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.anonymize, false);
    assert.equal(decision.reason, "accepted_too_recent");
  });

  it("anonymizes an orphan accepted request after six months", () => {
    const decision = decideAcceptedSignup(
      {
        id: "orphan",
        createdAt: "2025-01-01T00:00:00.000Z",
        inboxStatus: "accepted",
        status: "approved",
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.anonymize, true);
    assert.equal(decision.reason, "accepted_orphan_anonymize");
  });

  it("does not anonymize a held accepted request", () => {
    const decision = decideAcceptedSignup(
      {
        id: "held-accepted",
        createdAt: "2025-01-01T00:00:00.000Z",
        inboxStatus: "accepted",
        status: "approved",
        retentionHold: true,
      },
      now,
    );
    assert.equal(decision.purge, false);
    assert.equal(decision.anonymize, false);
    assert.equal(decision.reason, "retention_hold");
  });
});
