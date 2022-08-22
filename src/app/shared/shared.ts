export class CsvData {
  public _id!: string;
  public name!: string;
  public potential!: number;
  public performance!: number;
  public department!: string;
  public class!: string;
  public __v!: number;
}
export enum MatrixClass {
  ENIGMA = 'ENIGMA',
  GROWTH_EMPLOYEE = 'GROWTH_EMPLOYEE',
  FUTURE_LEADER = 'FUTURE_LEADER',
  DILEMMA = 'DILEMMA',
  CORE_EMPLOYEE = 'CORE_EMPLOYEE',
  HIGH_IMPACT_PERFORMER = 'HIGH_IMPACT_PERFORMER',
  UNDER_PERFORMER = 'UNDER_PERFORMER',
  EFFECTIVE = 'EFFECTIVE',
  TRUSTED_PROFESSIONAL = 'TRUSTED_PROFESSIONAL',
}
export const API_URL = 'http://localhost:3000/employees/data/';

export const classesExtraInfo = [
  {
    color: '#fdc844',
    info: 'Under-performer but loads of potentials\nDefinitely in wrong role\nCrucial Conversation\nMove out of role or you will lose this person',
  },
  {
    color: '#4ebb90',
    info: 'Meets all targets\nDemonstrates lots of potential-likely candidate for promotion\nDevelop & coach',
  },
  {
    color: '#36a0fe',
    info: 'Top Talent\nStrong candidate for promotion\nInclude in strategic initiatives\nProvide special development',
  },
  {
    color: '#f48a26',
    info: 'Under-performer\nLikely to be in wrong role\nCrucial Conversation\nMove out of role or manage out of business!',
  },
  {
    color: '#feca48',
    info: 'Meets all targets\nSome potential for growth\nProvide training & development opportunities',
  },
  {
    color: '#49b98e',
    info: 'Exceeds targets\nNeeds greater challenge\nProvide development\nGive stretch targets',
  },
  {
    color: '#fa5834',
    info: 'Under-performer\nOn an action contrast\nExit if no improvement within 3-months',
  },
  {
    color: '#f28921',
    info: 'Typical Joe Average\nLittle ambition\nMeets basic requirements\nSame job, same role forever!',
  },
  {
    color: '#ffca45',
    info: 'over-performer but not ambitious\nAt end of their stretch\nLoves their jobs\nFuture holds same type of role, same type of role, same type of team',
  },
];
