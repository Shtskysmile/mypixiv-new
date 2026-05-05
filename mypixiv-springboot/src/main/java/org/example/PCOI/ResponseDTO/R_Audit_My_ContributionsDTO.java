package org.example.PCOI.ResponseDTO;

import java.util.List;

public class R_Audit_My_ContributionsDTO {
    private List<R_OverviewContribution> pendingContributions;   // 待审核作品列表
    private List<R_OverviewContribution> approvedContributions;  // 审核通过作品列表
    private List<R_OverviewContribution> dismissalContributions; // 审核未通过作品列表

    public R_Audit_My_ContributionsDTO() {
    }

    public List<R_OverviewContribution> getPendingContributions() {
        return pendingContributions;
    }

    public void setPendingContributions(List<R_OverviewContribution> pendingContributions) {
        this.pendingContributions = pendingContributions;
    }

    public List<R_OverviewContribution> getApprovedContributions() {
        return approvedContributions;
    }

    public void setApprovedContributions(List<R_OverviewContribution> approvedContributions) {
        this.approvedContributions = approvedContributions;
    }

    public List<R_OverviewContribution> getDismissalContributions() {
        return dismissalContributions;
    }

    public void setDismissalContributions(List<R_OverviewContribution> dismissalContributions) {
        this.dismissalContributions = dismissalContributions;
    }
}
