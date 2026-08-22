# Instructions

- Use the appropriate skill from `/skills` for every task.
- Always invoke the `using-superpowers` skill at the start of any conversation/task to identify and execute the correct workflow.
- **Memory Protocol**: Read the context files in the `./ai` directory and CURRENT_SPRINT.md to maintain project memory. Update these context files after completing a milestone or task block (rather than every single prompt response) to save token space.
- **Design Guidelines**: Refer to `DESIGN.md` before starting any design, UI, or frontend work. Follow `DESIGN.md` and the selected skill as the primary implementation guides.
- **Framework & Folder Structure**: This project uses MongoDB and Mongoose. Use the `BackendMERNServerAgent` and `ReactContextApiAgent` skills to follow our folder structure and dataflow guidelines.
- **React Standards**: Follow React guidelines in the `vercel-react-best-practices` skill.
- **Token Efficiency**: When dispatching subagents, specify the exact file paths and line ranges in their prompts. Avoid letting subagents perform repository-wide file searches or read files unrelated to their target task.
- **Security**: DO NOT access the `.env` files. There is a config file loaded for the environment variables; read that file. If you still need a variable from `.env`, ask the user directly.
