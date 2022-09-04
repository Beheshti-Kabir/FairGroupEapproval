package org.fdl.approval.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import javax.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"trnscMaster"})
@Entity
@Table(name = "TRNSC_DETAIL")
public class TrnscDetail extends Abstract {

    @Column(name = "IS_QUANTITIVE", nullable = false)
    private boolean quantitive = true;

    @Column
    private Double qty;

    //@Column
    //private Double amount;

    @Column(name = "UNIT_PRICE")
    private Double unitPrice;

    @Column(name = "LINE_TOTAL", nullable = false)
    private double lineTotal;

    @Column(length = 4000)
    private String description;

    @Column(length = 4000)
    private String remarks;

    @Column(length = 20)
    private String currencyCode;

    @JsonIgnore
    // @ManyToOne(fetch = FetchType.LAZY)
    @ManyToOne
    @JoinColumn(name = "LOOKUP_DETAIL_PARTICULAR_ID")
    //@Column(name = "lookup_detail_particular_id")
    private LookupDetail lookupDetailParticular;
    //private Long lookupDetailParticular;
    //   @JsonIgnore

    @ManyToOne
    @JoinColumn(name = "LOOKUP_DETAIL_CURRENCY_ID")
    //@Column(name = "lookup_detail_particular_id")
    private LookupDetail lookupDetailCurrency;

    @ManyToOne(optional = false)
    @JoinColumn(name = "TRNSC_MASTER_ID", nullable = false)
    private TrnscMaster trnscMaster;

}
