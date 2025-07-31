package com.larplaner.model.role;

import com.larplaner.model.BaseEntity;
import com.larplaner.model.tag.Tag;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import lombok.AccessLevel;
import lombok.Builder.Default;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "roles")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@SuperBuilder
@Getter
@Setter
@ToString
public class Role extends BaseEntity {

  @Column(unique = true, nullable = false)
  private String name;

  @Column(length = 4096)
  private String description;

  @ManyToMany
  @Default
  private List<Tag> tags = new ArrayList<>();
}