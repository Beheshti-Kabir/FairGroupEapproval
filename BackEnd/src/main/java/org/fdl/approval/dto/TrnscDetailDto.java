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
public class TrnscDetailDto extends BaseDto {

    private _Mode _mode;
    
    private int _index;

    private boolean quantitive;
    
    //private Double amount;
    
    private Double qty;

    private Double unitPrice;

    private Double lineTotal;

    private String description;

    private String remarks;
    private String currencyCode;
    private LookupDetailDto lookupDetailParticular;
    private LookupDetailDto lookupDetailCurrency;

    //private TrnscMaster trnscMaster;
}
