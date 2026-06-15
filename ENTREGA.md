# Entrega

## 1. Evidencia

### Archivos

```
➜  ai4devs-openspect-sandbox-202606-roo git:(main) ✗ ls -la
ls -R openspec/
total 16
drwxr-xr-x 1 tatia 197609    0 Jun 15 23:21 .
drwxr-xr-x 1 tatia 197609    0 Jun 15 23:20 ..
drwxr-xr-x 1 tatia 197609    0 Jun 15 23:20 .git
drwxr-xr-x 1 tatia 197609    0 Jun 15 23:21 .vibe
drwxr-xr-x 1 tatia 197609    0 Jun 15 23:21 openspec
-rw-r--r-- 1 tatia 197609 3086 Jun 15 23:20 README.md
openspec/:
changes  config.yaml  specs

openspec/changes:
archive

openspec/changes/archive:

openspec/specs:
```
### OpenSpec

```
➜  ai4devs-openspect-sandbox-202606-roo git:(main) ✗ openspec --version
1.4.1
```

## 2. Pilares

*Micro-tarea:* 

Validación de email.

*Pilar 1 — Herramienta:* ¿Cuál eliges?  ¿Por qué esta y no otra?

Ministral. Velocidad y qualidad de respuestas.
Terminal, por facilidad y menos GUI.
WebStorm por comodidad.

*Pilar 2 — Contexto:* ¿Qué información estás aportando? (lenguaje, framework, restricciones, ejemplos…)
¿Hay algo del contexto que has decidido omitir conscientemente?


*Pilar 3 — Prompt:* ¿Cómo lo estructuras? (estilo, formato de salida, ejemplos…)
Pega aquí el prompt final que vas a lanzar.

```
Create a validator for users' inputed email. 
Consider different servers and countries alphabets for valid entries. 
Do not accept invalid characters.
Output should be a script that validates a string.
```

*Resultado:* ¿Funcionó a la primera o tuviste que iterar?
Una mejora que harías si volvieras a hacerlo

Fortificar la etapa de clarificación. Sugerir usar regex, ya que la primera iteración retornó una lista exaustiva de dominios validos por pais. 
Bloquear el uso de caracteres `+` para evitar alias.
Anadir casos de suceso y fallo.

## 3. Observaciones

- En `.vibe/skills/openspec-apply-change/SKILL.md`: `If `state: "all_done"`: congratulate`: Me hace gracia que tenga el "congratulate"
- El flujo de skills: apply-change, archive-change, explore, propose, sync-spec
- En `.vibe/skills/openspec-propose/SKILL.md`: pre definiciones de patrón, como kebab case