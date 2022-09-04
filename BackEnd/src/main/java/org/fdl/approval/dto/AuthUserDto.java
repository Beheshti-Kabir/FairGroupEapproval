package org.fdl.approval.dto;

import lombok.Data;

/**
 *
 * @author Manik
 */
@Data
//only active records
public class AuthUserDto extends BaseDto {

    private String name;
}
