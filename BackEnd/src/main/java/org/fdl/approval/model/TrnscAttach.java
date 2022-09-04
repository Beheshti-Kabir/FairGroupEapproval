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
@Table(name = "TRNSC_ATTACH")
public class TrnscAttach extends Abstract {

    @Column(length = 100, nullable = false, unique = true)
    private String code;

    @Column(length = 255, nullable = false)
    private String name;

    @Column(name = "CONTENT_TYPE", length = 100)
    private String contentType;

    @Column(name = "FILE_SIZE", nullable = false)
    private Long fileSize;

    @Column(name = "IS_ACTIVE", nullable = false)
    private boolean active = Boolean.TRUE;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "TRNSC_MASTER_ID", nullable = false)
    private TrnscMaster trnscMaster;

}