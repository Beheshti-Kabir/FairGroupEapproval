package org.fdl.approval.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.math.BigDecimal;

@Getter
@Setter
@Builder
@ToString
public class StatementDto {

    private String transactionDate;
    private String description;
    private BigDecimal deposit;
    private BigDecimal withdrawal;

}
