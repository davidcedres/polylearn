# Knowledge Tracing

## Schema

Skill { name }
Question { belongs to skill, text }
Answer { belongs to question, text }
Submit { belongs to user, belongs to question, answer id}
