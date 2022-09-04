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
public class AmeLineDto extends BaseDto {

    private _Mode _mode;

    private int _index;

    private boolean active = Boolean.TRUE;

    private Integer slNo;
    private String remarks;
    private AmeCondiDto ameCondi;
    private AmeGroupDto ameGroup;
    private AmeDto ame;

}