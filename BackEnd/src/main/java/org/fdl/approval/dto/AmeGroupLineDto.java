package org.fdl.approval.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
//only active records
public class AmeGroupLineDto extends BaseDto {

    private _Mode _mode;
    
    private int _index;

    private Integer slNo;
    private AprvUserGroupDto aprvUserGroup;
    private AmeGroupDto ameGroup;
    private boolean active = Boolean.TRUE;

}