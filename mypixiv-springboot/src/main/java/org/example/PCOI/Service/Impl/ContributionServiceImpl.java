package org.example.PCOI.Service.Impl;

import org.example.PCOI.Entity.Comment;
import org.example.PCOI.Entity.Contribution;
import org.example.PCOI.Entity.Tag;
import org.example.PCOI.Entity.User;
import org.example.PCOI.Mapper.*;
import org.example.PCOI.ResponseDTO.*;
import org.example.PCOI.Service.Inter.ContributionService;
import org.example.PCOI.Service.Support.FileStorageService;
import org.example.PCOI.Service.Support.TransformService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

import static org.example.PCOI.Service.Support.Enum.*;
import static org.example.PCOI.Service.Support.Ensure.*;

@Service
public class ContributionServiceImpl implements ContributionService {

    private static final Logger log = Logger.getLogger(ContributionServiceImpl.class.getName());

    @Autowired
    private ContributionMapper contributionmapper;
    @Autowired
    private UserMapper usermapper;
    @Autowired
    private CommentMapper commentmapper;
    @Autowired
    private LikeMapper likemapper;
    @Autowired
    private FavoriteMapper favoritemapper;
    @Autowired
    private TagMapper tagmapper;
    @Autowired
    private TagRelationMapper tagRelationMapper;
    @Autowired
    private FileStorageService fileStorageService;
    @Autowired
    private TransformService transformService;

    @Override
    public List<R_OverviewContribution> getIllustrations() {
        List<R_OverviewContribution> list = new ArrayList<>();
        List<Contribution> contributions = contributionmapper.selectContributionsByType(illustration);
        for(Contribution contribution : contributions){
            User user = usermapper.selectUserById(contribution.getAuthorId());
            R_OverviewContribution r = transformService.transformContributionToROverviewContribution(
                    contribution, user.getAvatar(), user.getUsername());
            list.add(r);
        }
        return list;
    }

    @Override
    public List<R_OverviewContribution> getMangas() {
        List<R_OverviewContribution> list = new ArrayList<>();
        List<Contribution> contributions = contributionmapper.selectContributionsByType(manga);
        for(Contribution contribution : contributions){
            User user = usermapper.selectUserById(contribution.getAuthorId());
            R_OverviewContribution r = transformService.transformContributionToROverviewContribution(
                    contribution, user.getAvatar(), user.getUsername());
            list.add(r);
        }
        return list;
    }

    @Override
    public List<R_OverviewContribution> getAllContributions() {
        List<R_OverviewContribution> list = new ArrayList<>();
        List<Contribution> contributions = contributionmapper.selectAllContributions();
        for(Contribution contribution : contributions){
            User user = usermapper.selectUserById(contribution.getAuthorId());
            R_OverviewContribution r = transformService.transformContributionToROverviewContribution(
                    contribution, user.getAvatar(), user.getUsername());
            list.add(r);
        }
        return list;
    }

    @Override
    public R_ContributionDTO getContribution(String userId, String contributionId) {
        Contribution contribution = notNull(contributionmapper.selectContributionById(contributionId), "作品不存在");

        // 评论列表
        List<Comment> comments = commentmapper.selectCommentsByContributionId(contributionId);
        List<R_ContributionComment> rComments = new ArrayList<>();
        for(Comment comment : comments) {
            User commentUser = usermapper.selectUserById(comment.getAuthor());
            rComments.add(transformService.transformCommentToRContributionComment(
                    comment, commentUser.getAvatar(), commentUser.getUsername()));
        }

        // 标签
        List<Integer> tagIds = tagRelationMapper.getContributionTags(contributionId);
        List<Tag> tags = new ArrayList<>();
        for(Integer tagId : tagIds){
            Tag tag = tagmapper.selectTagById(tagId);
            tags.add(tag);
        }

        User author = usermapper.selectUserById(contribution.getAuthorId());
        R_Contribution rContribution = transformService.transformContributionToRContribution(
                contribution, author.getAvatar(), author.getUsername(), tags);

        boolean isLiked = likemapper.isLike(userId, contributionId);
        boolean isFavorite = favoritemapper.isFavorite(userId, contributionId);

        R_ContributionDTO dto = new R_ContributionDTO();
        dto.setContribution(rContribution);
        dto.setComments(rComments);
        dto.setIsLiked(isLiked);
        dto.setIsFavorite(isFavorite);
        return dto;
    }

    @Override
    public R_Contribution getPendingContribution(String userId, Integer role, String contributionId) {
        Contribution contribution;
        if (role != null && role.equals(communityAdmin)) {
            contribution = contributionmapper.selectPendingContributionById(contributionId);
        } else {
            contribution = contributionmapper.selectNoAuditContributionById(contributionId);
            if (contribution != null) {
                isTrue(contribution.getAuthorId().equals(userId), "无权查看该待审核作品");
            }
        }
        contribution = notNull(contribution, "作品不存在或无权访问");

        User author = usermapper.selectUserById(contribution.getAuthorId());
        List<Integer> tagIds = tagRelationMapper.getContributionTags(contributionId);
        List<Tag> tags = new ArrayList<>();
        for(Integer tagId : tagIds){
            Tag tag = tagmapper.selectTagById(tagId);
            tags.add(tag);
        }
        return transformService.transformContributionToRContribution(contribution, author.getAvatar(), author.getUsername(), tags);
    }

    @Override
    public List<R_OverviewContribution> getContributionsRanking(Integer type, Integer key) {
        if(type == null || key == null) return List.of();
        List<Contribution> contributions;
        if(key.equals(viewCount)) {
            contributions = contributionmapper.selectContributionsByTypeAndViewCount(type, maxSearchLimit);
        } else if(key.equals(favoriteCount)) {
            contributions = contributionmapper.selectContributionsByTypeAndFavoriteCount(type, maxSearchLimit);
        } else if(key.equals(likeCount)) {
            contributions = contributionmapper.selectContributionsByTypeAndLikeCount(type, maxSearchLimit);
        } else {
            contributions = contributionmapper.selectContributionsByTypeAndCommentCount(type, maxSearchLimit);
        }

        List<R_OverviewContribution> list = new ArrayList<>();
        for(Contribution contribution : contributions){
            User user = usermapper.selectUserById(contribution.getAuthorId());
            list.add(transformService.transformContributionToROverviewContribution(contribution, user.getAvatar(), user.getUsername()));
        }
        return list;
    }

    @Override
    public boolean likeContribution(String userId, String contributionId) {
        if (likemapper.isLike(userId, contributionId)) return true;
        likemapper.insertLike(userId, contributionId);

        Contribution contribution = notNull(contributionmapper.selectContributionById(contributionId), "作品不存在");
        contribution.setLikeCount(contribution.getLikeCount() + 1);
        contributionmapper.updateContribution(contribution);
        return true;
    }

    @Override
    public boolean unlikeContribution(String userId, String contributionId) {
        if (!likemapper.isLike(userId, contributionId)) return true;
        likemapper.deleteLike(userId, contributionId);

        Contribution contribution = notNull(contributionmapper.selectContributionById(contributionId), "作品不存在");
        contribution.setLikeCount(contribution.getLikeCount() - 1);
        contributionmapper.updateContribution(contribution);
        return true;
    }

    @Override
    public boolean favoriteContribution(String userId, String contributionId) {
        if (favoritemapper.isFavorite(userId, contributionId)) return true;
        favoritemapper.insertFavorite(userId, contributionId);

        Contribution contribution = notNull(contributionmapper.selectContributionById(contributionId), "作品不存在");
        contribution.setFavoriteCount(contribution.getFavoriteCount() + 1);
        contributionmapper.updateContribution(contribution);
        return true;
    }

    @Override
    public boolean unfavoriteContribution(String userId, String contributionId) {
        if (!favoritemapper.isFavorite(userId, contributionId)) return true;
        favoritemapper.deleteFavorite(userId, contributionId);

        Contribution contribution = notNull(contributionmapper.selectContributionById(contributionId), "作品不存在");
        contribution.setFavoriteCount(contribution.getFavoriteCount() - 1);
        contributionmapper.updateContribution(contribution);
        return true;
    }

    @Override
    public boolean commentContribution(String userId, String contributionId, String comment) {
        Comment newComment = new Comment();
        newComment.setCommentId(UUID.randomUUID().toString().replace("-", ""));
        newComment.setAuthor(userId);
        newComment.setContribution(contributionId);
        newComment.setDescription(comment);
        commentmapper.insertComment(newComment);

        Contribution contribution = notNull(contributionmapper.selectContributionById(contributionId), "作品不存在");
        contribution.setCommentCount(contribution.getCommentCount() + 1);
        contributionmapper.updateContribution(contribution);
        return true;
    }

    @Override
    public boolean uploadContribution(String userId, String title, Integer type, String description, List<String> tags, List<MultipartFile> images) {
        Contribution contribution = new Contribution();
        contribution.setType(type);
        contribution.setTitle(title);
        contribution.setDescription(description);
        contribution.setAuthorId(userId);

        List<String> imageUrls = fileStorageService.saveWorkImages(images, type, userId);
        contribution.setImage(imageUrls);

        // 插入作品（contributionId 由 @SelectKey 回填）
        contributionmapper.insertContribution(contribution);

        // 标签关系
        if (tags != null && !tags.isEmpty()) {
            for (String tagName : tags) {
                Tag tag = tagmapper.selectTagByName(tagName);
                if (tag == null) {
                    tagmapper.insertTag(tagName);
                    tag = tagmapper.selectTagByName(tagName);
                }
                // tag 理论上不会为 null，但防御一下
                if (tag != null) {
                    tagRelationMapper.insertTagRelation(contribution.getContributionId(), tag.getId());
                }
            }
        }
        return true;
    }
}
