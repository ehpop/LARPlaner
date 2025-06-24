package com.larplaner.repository.tag;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.larplaner.model.tag.Tag;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {

  List<Tag> findByValueContainingIgnoreCase(String value);
}