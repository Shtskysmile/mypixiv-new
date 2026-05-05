package org.example.PCOI.ResponseDTO;

import java.util.List;

public class R_ContributionDTO {
    private R_Contribution contribution;              // 作品信息
    private List<R_ContributionComment> comments;      // 作品评论列表
    private Boolean isLiked;                           // 是否已点赞
    private Boolean isFavorite;                        // 是否已收藏

    public R_ContributionDTO() {
    }

    public R_Contribution getContribution() {
        return contribution;
    }

    public void setContribution(R_Contribution contribution) {
        this.contribution = contribution;
    }

    public List<R_ContributionComment> getComments() {
        return comments;
    }

    public void setComments(List<R_ContributionComment> comments) {
        this.comments = comments;
    }

    public Boolean getIsLiked() {
        return isLiked;
    }

    public void setIsLiked(Boolean isLiked) {
        this.isLiked = isLiked;
    }

    public Boolean getIsFavorite() {
        return isFavorite;
    }

    public void setIsFavorite(Boolean isFavorite) {
        this.isFavorite = isFavorite;
    }
}
