import { createContext, useEffect, useReducer } from "react";

import * as teamsService from "../services/teamsService";
import { teamStateManagementCommands } from "../util/teamReducerCommands";

export const TeamContext = createContext();

const teamReducer = (state, action) => {
  switch (action.type) {
    case teamStateManagementCommands.getAll:
      return [...action.payload];
    case teamStateManagementCommands.add:
      return [...state, action.payload];
    default:
      return state;
  }
};

export function TeamProvider({ children }) {
  const [teams, dispatch] = useReducer(teamReducer, []);

  useEffect(() => {
    teamsService.getAll().then((result) => {
      if (result.code === 404) {
        return;
      } else {
        const action = {
          type: teamStateManagementCommands.getAll,
          payload: result,
        };

        dispatch(action);
      }
    });
  }, []);

  const selectTeam = (teamId) => {
    return teams.find((x) => x._id === teamId) || {};
  };

  const teamAdd = (teamData) => {
    dispatch({
      type: teamStateManagementCommands.add,
      payload: teamData,
    });
  };

  return (
    <TeamContext.Provider
      value={{
        teams,
        selectTeam,
        teamAdd,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
}
