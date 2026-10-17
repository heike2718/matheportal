import { berechtigungVerweigert, selectSchulauswahlMoeglich } from '../data/+state/lehrperson.selectors';

export const isSchulauswahlMoeglich = selectSchulauswahlMoeglich;
export const schulenLadenVerweigert = berechtigungVerweigert;
