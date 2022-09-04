package org.fdl.approval.dto;

import lombok.Data;

/**
 *
 * @author Manik
 */
@Data
//only active records
public class CompanyInfoDto extends BaseDto {

    private String companyName;
    private String code;

}
