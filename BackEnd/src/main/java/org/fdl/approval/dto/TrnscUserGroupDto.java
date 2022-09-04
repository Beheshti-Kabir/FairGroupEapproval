package org.fdl.approval.dto;

import java.util.ArrayList;
import java.util.List;
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
//@ToString(exclude = {"lookupDetailDependent"})
public class TrnscUserGroupDto extends BaseVersionDto {

    //private String name;
    //private String description;
    //LookupDetail lookupDetailTrnscType
    private LookupDetailDto lookupDetailTrnscType;

    private boolean active = Boolean.TRUE;

    private List<TrnscUserGroupLineDto> lines = new ArrayList();

}
