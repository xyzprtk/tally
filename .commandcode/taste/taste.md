# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# architecture
- Single-user application, no authentication required, store settings in localStorage. Confidence: 0.50
- LLM generates Python/pandas code for data queries, backend executes it in sandboxed environment. Confidence: 0.50

# frontend
- Use pre-built UI widgets with dropdowns for basic analytics operations (no typed query language). Confidence: 0.50
- API key configured via gear icon on frontend, supporting OpenRouter and Groq providers. Confidence: 0.50
- Use TypeScript with shadcn/ui for the frontend stack. Confidence: 0.50

# data
- Accept CSV and JSON file formats only for dataset uploads. Confidence: 0.50

# analytics
- Support descriptive statistics, visualizations, and data operations as basic analytics categories. Confidence: 0.50

# chat
- Include full conversation history in LLM chatbox for follow-up context between queries. Confidence: 0.50

# visualization
- Render plots using Matplotlib → PNG image, returned as base64 to the frontend. Confidence: 0.50

# backend
- Use pandas + matplotlib for data analysis, direct API calls to OpenRouter/Groq (not LiteLLM), and simple REST API endpoints. Confidence: 0.50

# sandboxing
- Use basic restrictions for LLM-generated code execution: subprocess with restricted imports (no os, sys, subprocess, shutil), timeout, and memory limits. Confidence: 0.50

# project-structure
- Use monorepo structure with separate /backend (FastAPI) and /frontend (Next.js) directories. Confidence: 0.50

# data-management
- Support one dataset at a time: uploading a new dataset replaces the current one and resets chat. Confidence: 0.50

# chat-persistence
- Chat history is ephemeral and lost on page reload; no localStorage or backend persistence for now. Confidence: 0.50

# error-handling
- When LLM-generated code fails, return the error to chat and offer user a retry (no auto-retry with error feedback to LLM). Confidence: 0.50

# git
- Use commit format: feat/fix/update/chore : one_line_description_of_change. Do not include phase/step numbers in commit messages. Confidence: 0.70

# workflow
- Implement complex plans one phase at a time, completing each step before moving to the next. Confidence: 0.70

