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
//@ToString(exclude = {"lookupDetailDependent"})
public class AprvUserGroupLineDto extends BaseDto {

    private _Mode _mode;

    private int _index;

    private boolean active = Boolean.TRUE;

    private AuthUserDto authUser;

}
