package com.larplaner.repository.tag;

import com.larplaner.model.tag.Tag;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TagRepository extends JpaRepository<Tag, UUID> {

  List<Tag> findByValueContainingIgnoreCase(String value);

  List<Tag> findByValueInIgnoreCase(Collection<String> values);

}