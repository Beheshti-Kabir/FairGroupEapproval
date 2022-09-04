package org.fdl.approval.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

/**
 *
 * @author Manik
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
//@ToString(exclude = {"lookupDetailDependent"})
public class AmeDto extends BaseVersionDto {

    private String name;
    private String description;
    private String formName;
    private String baseTable;
    private String primaryKey;
    private String parameterName;
    private String urlLink;
    private String transType;
    private boolean active = Boolean.TRUE;

    private List<AmeLineDto> lines = new ArrayList();

}