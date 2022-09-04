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
public class AmeCondiLineDto extends BaseDto {

    private _Mode _mode;

    private int _index;

    private Integer slNo;

    private String condiSql;

    private boolean active = Boolean.TRUE;

}