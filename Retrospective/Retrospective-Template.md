TEMPLATE FOR RETROSPECTIVE (Team R3)
=====================================

The retrospective should include _at least_ the following
sections:

- [process measures](#process-measures)
- [quality measures](#quality-measures)
- [general assessment](#assessment)

## PROCESS MEASURES 

### Macro statistics

- Number of stories committed vs done: 9 vs 2
- Total points committed vs done: 139 vs 6
- Nr of hours planned vs spent (as a team): 40h vs 40h

**Remember**  a story is done ONLY if it fits the Definition of Done:
 
- Code present on VCS

### Detailed statistics

| Story  | # Tasks | Points | Hours est. | Hours actual |
|:------:|:---------:|:--------:|:-------:|:-------:|
| _#0_   | - | - | _9_ | _8_ |
| _#1_   |    _#4_     | _1_   |   _15_   |   _15_   |
| _#2_   |     _#6_    |    _5_    |  _16_  |  _18_ |
   
- Hours per task (average, standard deviation): 2.57
- Total task estimation error ratio: sum of total hours estimation / sum of total hours spent from previous table: 0.98

  
## QUALITY MEASURES 

- Unit Testing:
  - Total hours estimated
  - Total hours spent
  - Nr of automated unit test cases 
  - Coverage (if available)
- E2E testing:
  - Total hours estimated
  - Total hours spent
- Code review 
  - Total hours estimated 
  - Total hours spent
- Technical Debt management:
  - Total hours estimated 
  - Total hours spent
  - Hours estimated for remediation by SonarQube
  - Hours spent on remediation 
  - debt ratio (as reported by SonarQube under "Measures-Maintainability")
  - rating for each quality characteristic reported in SonarQube under "Measures" (namely reliability, security, maintainability )
  


## ASSESSMENT

- What caused your errors in estimation (if any)? 
  
    - We thought that story #3 was independent so it has been incorrectly estimated. Then it was considered as a task of story #2 and the resulting effort was slightly higher.
- What lessons did you learn (both positive and negative) in this sprint?
    - CONS: It is better to overestimate than underestimate.
    - PROS: We've found out that Agile approach performs better than traditional planning methodology (e.g. waterfall).

- Which improvement goals set in the previous retrospective were you able to achieve? 
  
- Which ones you were not able to achieve? Why?

- Improvement goals for the next sprint and how to achieve them (technical tasks, team coordination, etc.)
    - Better distribution of workloads, since we didn't know each other
    - Better organization of the Git, about branche creation and the core commands


- One thing you are proud of as a Team!!
    - Even if we are only five people, we have different background knowlege and we share many good ideas.