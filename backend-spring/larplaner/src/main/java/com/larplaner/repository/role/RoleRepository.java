package com.larplaner.repository.role;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.larplaner.model.role.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, UUID> {

}