package org.example.PCOI.Entity;

public class Tag {
    private Integer id;      // tag ID 自增
    private String tagName;  // tag名称

    public Tag() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTagName() {
        return tagName;
    }

    public void setTagName(String tagName) {
        this.tagName = tagName;
    }
}
