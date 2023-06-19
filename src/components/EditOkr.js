import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { Dropdown } from "./Dropdown";

import * as okrService from "../services/okrService";
import * as userService from "../services/userService";
import { OkrContext } from "../contexts/OkrContext";

export function EditOkr() {
  const [dropdownUsers, setDropdownUsers] = useState([]);
  const { okrEdit } = useContext(OkrContext);
  const { okrId } = useParams();
  const navigate = useNavigate();
  let owners = "";

  useEffect(() => {
    userService.getAllUsers().then((result) => {
      let arr = [];
      for (const user of result) {
        arr.push({
          value: user.username.toLowerCase(),
          label: user.username,
        });
      }
      setDropdownUsers(arr);
    });
  }, []);

  const [okr, setOkr] = useState({});
  useEffect(() => {
    okrService.getOne(okrId).then((result) => {
      setOkr(result);
    });
    // eslint-disable-next-line
  }, []);

  let owners2 = "";
  if (okr.okrOwners) {
    owners2 = okr.okrOwners.join(", ");
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const okrData = Object.fromEntries(new FormData(e.target));
    const ownersArray = owners.map((x) => x.label);
    okrData.okrOwners = ownersArray;

    okrService.edit(okrId, okrData).then((result) => {
      okrEdit(okrId, result);
      navigate(`/`);
    });
  };

  return (
    <section>
      <form id="createForm" onSubmit={onSubmit}>
        <div>
          <h1>Edit OKR</h1>
        </div>
        <div>
          <i className="fa-solid fa-pencil"></i>
          <label htmlFor="okrTitle">Edit OKR Title</label>
          <input name="okrTitle" type="okrTitle" defaultValue={okr.okrTitle} />
        </div>
        <div>
          <label htmlFor="okrTitle">Owner</label>
          <Dropdown
            isSearchable
            isMulti
            placeHolder={owners2}
            options={dropdownUsers}
            onChange={(value) => (owners = value)}
          ></Dropdown>
        </div>
        <div>
          <button className="createBtn">Press Enter to submit editing</button>
        </div>
      </form>
    </section>
  );
}
