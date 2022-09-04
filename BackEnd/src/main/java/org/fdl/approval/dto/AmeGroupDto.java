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
public class AmeGroupDto extends BaseVersionDto {

    private String description;
    private boolean active = Boolean.TRUE;
    private List<AmeGroupLineDto> lines = new ArrayList();

}