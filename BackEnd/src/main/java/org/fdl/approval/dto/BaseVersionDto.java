package org.fdl.approval.dto;

import lombok.Data;

/**
 *
 * @author Manik
 */
@Data
//only active records
public abstract class BaseVersionDto extends BaseDto {

    private Integer version;
}
