package org.example.PCOI.ResponseDTO;

public class R_UserComment {
    private R_ContributionComment comment;          // 评论内容
    private R_OverviewContribution contribution;    // 作品概览

    public R_UserComment() {
    }

    public R_ContributionComment getComment() {
        return comment;
    }

    public void setComment(R_ContributionComment comment) {
        this.comment = comment;
    }

    public R_OverviewContribution getContribution() {
        return contribution;
    }

    public void setContribution(R_OverviewContribution contribution) {
        this.contribution = contribution;
    }
}
