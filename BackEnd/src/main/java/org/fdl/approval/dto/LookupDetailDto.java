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
public class LookupDetailDto extends BaseDto {

    private _Mode _mode;
    
    private int _index;

    private String code;

    private String description;

    private boolean entryEnable = Boolean.TRUE;

    private boolean active = Boolean.TRUE;

}
