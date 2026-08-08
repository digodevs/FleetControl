package com.fleetcontrol.repository;

import com.fleetcontrol.entity.Role;
import com.fleetcontrol.entity.RoleName;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(RoleName name);
}

