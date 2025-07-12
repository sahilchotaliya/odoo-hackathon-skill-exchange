package com.skillswap.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String location;
    private String profilePhoto;
    private String availability;
    private boolean isPublic;
    private Set<String> skillsOffered;
    private Set<String> skillsWanted;
}