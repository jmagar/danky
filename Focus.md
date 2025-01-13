# Project Focus: danky

**Current Goal:** No description available

**Key Components:**
├─ 📄 ARCHITECTURE.md
├─ 📄 Focus.md
├─ 📄 README.md
├─ 📄 VERSION_REQUIREMENTS.md
├─ 📄 dank-context.md
├─ 📄 danky.code-workspace
├─ 📄 docker-compose.yml
├─ 📄 eslint.config.js
├─ 📄 mcp-config.json5
├─ 📄 package.json
├─ 📄 pnpm-lock.yaml
├─ 📄 pnpm-workspace.yaml
├─ 📄 repomix.config.json
├─ 📄 turbo.json
├─ 📁 apps
│  └─ 📁 web
│     ├─ 📄 README.md
│     ├─ 📄 components.json
│     ├─ 📄 env.ts
│     ├─ 📄 mcp-server-guide.md
│     ├─ 📄 next-env.d.ts
│     ├─ 📄 next.config.js
│     ├─ 📄 package.json
│     ├─ 📄 postcss.config.js
│     ├─ 📄 tailwind.config.js
│     ├─ 📄 tsconfig.json
│     ├─ 📄 types.d.ts
│     └─ 📁 app
│        └─ 📄 providers.tsx
├─ 📁 packages
│  ├─ 📁 build-config
│  │  ├─ 📄 package.json
│  │  ├─ 📄 tsconfig.json
│  │  └─ 📁 src
│  │     ├─ 📄 base.ts
│  │     ├─ 📄 index.ts
│  │     ├─ 📄 node-library.ts
│  │     └─ 📄 react-library.ts
│  ├─ 📁 db
│  │  ├─ 📄 README.md
│  │  ├─ 📄 drizzle.config.ts
│  │  ├─ 📄 eslint.config.js
│  │  ├─ 📄 package.json
│  │  ├─ 📄 tsconfig.json
│  │  ├─ 📄 tsup.config.bundled_tcbbkimm6si.mjs
│  │  ├─ 📄 tsup.config.bundled_txmawbqz3cg.mjs
│  │  ├─ 📄 tsup.config.ts
│  │  ├─ 📁 drizzle
│  │  │  ├─ 📄 0000_noisy_phil_sheldon.sql
│  │  │  └─ 📄 0001_chat_schema_improvements.sql
│  │  └─ 📁 src
│  │     ├─ 📄 client.ts
│  │     ├─ 📄 env.ts
│  │     ├─ 📄 index.ts
│  │     ├─ 📄 migrate.ts
│  │     └─ 📄 seed.ts
│  ├─ 📁 eslint-config
│  │  ├─ 📄 README.md
│  │  ├─ 📄 base.js
│  │  ├─ 📄 index.js
│  │  ├─ 📄 next.js
│  │  ├─ 📄 package.json
│  │  └─ 📄 react-internal.js
│  ├─ 📁 logger
│  │  ├─ 📄 README.md
│  │  ├─ 📄 eslint.config.js
│  │  ├─ 📄 package.json
│  │  ├─ 📄 tsconfig.json
│  │  ├─ 📄 tsup.config.ts
│  │  └─ 📁 src
│  │     ├─ 📄 env.ts
│  │     ├─ 📄 index.ts
│  │     └─ 📄 logger.ts
│  ├─ 📁 mcp
│  │  ├─ 📄 README.md
│  │  ├─ 📄 eslint.config.js
│  │  ├─ 📄 package.json
│  │  ├─ 📄 tsconfig.json
│  │  └─ 📁 src
│  │     ├─ 📄 index.ts
│  │     ├─ 📄 init-chat-model.ts
│  │     ├─ 📄 load-config.ts
│  │     └─ 📄 logger.ts
│  ├─ 📁 next-config
│  │  ├─ 📄 package.json
│  │  ├─ 📄 tsconfig.json
│  │  └─ 📁 src
│  │     ├─ 📄 base.ts
│  │     ├─ 📄 index.ts
│  │     └─ 📄 webpack.ts
│  ├─ 📁 postcss-config
│  │  ├─ 📄 package.json
│  │  ├─ 📄 tsconfig.json
│  │  └─ 📁 src
│  │     ├─ 📄 base.ts
│  │     ├─ 📄 index.ts
│  │     └─ 📄 tailwind.ts
│  ├─ 📁 qdrant
│  │  ├─ 📄 eslint.config.js
│  │  ├─ 📄 package.json
│  │  ├─ 📄 tsconfig.json
│  │  ├─ 📄 tsup.config.ts
│  │  └─ 📁 src
│  │     ├─ 📄 client.ts
│  │     ├─ 📄 env.ts
│  │     └─ 📄 index.ts
│  ├─ 📁 redis
│  │  ├─ 📄 eslint.config.js
│  │  ├─ 📄 package.json
│  │  ├─ 📄 tsconfig.json
│  │  ├─ 📄 tsup.config.ts
│  │  └─ 📁 src
│  │     ├─ 📄 client.ts
│  │     ├─ 📄 env.ts
│  │     └─ 📄 index.ts
│  ├─ 📁 schema
│  │  ├─ 📄 README.md
│  │  ├─ 📄 eslint.config.js
│  │  ├─ 📄 package.json
│  │  ├─ 📄 tsconfig.json
│  │  ├─ 📄 tsup.config.ts
│  │  └─ 📁 src
│  │     ├─ 📄 chat-batch.ts
│  │     ├─ 📄 chat-session.ts
│  │     ├─ 📄 chat.ts
│  │     ├─ 📄 index.ts
│  │     ├─ 📄 metadata.ts
│  │     ├─ 📄 test-eslint.ts
│  │     ├─ 📄 types.ts
│  │     └─ 📄 vector.ts
│  ├─ 📁 tailwind-config
│  │  ├─ 📄 package.json
│  │  ├─ 📄 tsconfig.json
│  │  └─ 📁 src
│  │     ├─ 📄 applications.ts
│  │     ├─ 📄 base.ts
│  │     ├─ 📄 components.ts
│  │     └─ 📄 index.ts
│  ├─ 📁 typescript-config
│  │  ├─ 📄 base.json
│  │  ├─ 📄 nextjs.json
│  │  ├─ 📄 package.json
│  │  └─ 📄 react-library.json
│  └─ 📁 ui
│     ├─ 📄 README.md
│     ├─ 📄 components.json
│     ├─ 📄 eslint.config.js
│     ├─ 📄 package.json
│     ├─ 📄 tailwind.config.js
│     ├─ 📄 tsconfig.json
│     ├─ 📄 tsup.config.ts
│     └─ 📁 src
│        ├─ 📄 button.tsx
│        ├─ 📄 card.tsx
│        ├─ 📄 code.tsx
│        ├─ 📄 index.ts
│        └─ 📄 types.ts
└─ 📁 src
   └─ 📁 components
      └─ 📁 ui
         └─ 📄 accordion.tsx

**Project Context:**
Type: Node.js Project
Target Users: Users of danky
Main Functionality: No description available
Key Requirements:
- Version: unknown
- Type: Node.js Project
- Dependency: @anthropic-ai/sdk
- Dependency: @h1deya/langchain-mcp-tools
- Dependency: @langchain/core

**Development Guidelines:**
- Keep code modular and reusable
- Follow best practices for the project type
- Maintain clean separation of concerns

# File Analysis
`eslint.config.js` (4 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`src/components/ui/accordion.tsx` (61 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/env.ts` (29 lines)
**Main Responsibilities:** TypeScript source file

`apps/web/next-env.d.ts` (6 lines)
**Main Responsibilities:** TypeScript source file

`apps/web/tailwind.config.js` (77 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`apps/web/postcss.config.js` (7 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`apps/web/next.config.js` (55 lines)
**Main Responsibilities:** JavaScript file for client-side functionality
**Key Functions:**
<webpack>: Takes config and { is server }

`apps/web/types.d.ts` (19 lines)
**Main Responsibilities:** TypeScript source file

`apps/web/src/components/toaster.tsx` (2 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/providers.tsx` (17 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Providers>: Takes { children }

`apps/web/src/components/mcp/mcp-panel.tsx` (92 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<MCPPanel>: Takes { on tool select }
<fetchData>: Retrieves data data | This function helps with the program's functionality

`apps/web/src/components/mcp/tools-button.tsx` (114 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<onToolSelect>: Takes server id and tool id
<ToolsButton>: Takes { servers and on tool select and class name }

`apps/web/src/components/mcp/index.ts` (4 lines)
**Main Responsibilities:** TypeScript source file

`apps/web/src/components/mcp/servers/server-card.tsx` (41 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<ServerCard>: Takes { server id and status and description and on select }

`apps/web/src/components/mcp/servers/server-list.tsx` (36 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<ServerList>: Takes { servers and on server select }

`apps/web/src/components/mcp/tools/tool-list.tsx` (38 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<ToolList>: Takes { tools and on tool select }

`apps/web/src/components/mcp/tools/tool-card.tsx` (33 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<ToolCard>: This function helps with the program's functionality

`apps/web/src/components/theme/theme-provider.tsx` (21 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<ThemeProvider>: Takes { children and ...props }

`apps/web/src/components/theme/theme-toggle.tsx` (24 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<ThemeToggle>: This function helps with the program's functionality

`apps/web/src/components/chat/search.tsx` (117 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Search>: This function helps with the program's functionality
<down>: Takes e

`apps/web/src/components/chat/user-nav.tsx` (113 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<UserNav>: This function helps with the program's functionality

`apps/web/src/components/chat/sidebar.tsx` (250 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Sidebar>: This function helps with the program's functionality
**📄 Length Alert: File exceeds recommended length (250 lines vs. recommended 250)**

`apps/web/src/components/chat/chat-layout.tsx` (21 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<ChatLayout>: Takes { children and sidebar }

`apps/web/src/components/chat/types.ts` (59 lines)
**Main Responsibilities:** TypeScript source file

`apps/web/src/components/chat/message.tsx` (31 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Message>: Takes { message and class name }

`apps/web/src/components/chat/utils.ts` (74 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<formatTime>: This function validates messageDate.toDateString( and messageDate.getFullYear( | Takes date
<declarations>: This function validates input | Takes pattern

`apps/web/src/components/chat/message-content.tsx` (60 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<MessageContent>: This function helps with the program's functionality

`apps/web/src/components/chat/notifications-popover.tsx` (43 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<NotificationsPopover>: This function helps with the program's functionality

`apps/web/src/components/chat/chat-input.tsx` (69 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<ChatInput>: Takes { is processing and servers and on tool select
<handleSubmit>: Processes submit | Takes event
<handleKeyDown>: Processes key down | Takes e

`apps/web/src/components/chat/chat-messages.tsx` (19 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<ChatMessages>: This function processes messages

`apps/web/src/components/chat/tools-dropdown.tsx` (110 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<onToolSelect>: Takes server id and tool id
<ToolsDropdown>: Takes { servers and on tool select and is loading

`apps/web/src/components/sidebar/sidebar-types.ts` (23 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<setOpen>: Updates open | Takes open
<setOpenMobile>: Updates open mobile | Takes open
<toggleSidebar>: This function helps with the program's functionality

`apps/web/src/components/sidebar/sidebar-group.tsx` (73 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/sidebar/index.tsx` (42 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/sidebar/sidebar-item.tsx` (88 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/sidebar/sidebar-section.tsx` (63 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/sidebar/sidebar.tsx` (34 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/sidebar/sidebar-menu.tsx` (150 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/sidebar/sidebar-context.tsx` (32 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<useSidebarContext>: Returns context
<SidebarProvider>: Takes { children and default open

`apps/web/src/components/sidebar/sidebar-sections.tsx` (73 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/sidebar/sidebar-search.tsx` (27 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/sidebar/sidebar-menu-extras.tsx` (57 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/sidebar/sidebar-content.tsx` (27 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/sidebar/sidebar-menu-sub.tsx` (56 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/sidebar/sidebar-trigger.tsx` (34 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/sidebar/sidebar-layout.tsx` (49 lines)
**Main Responsibilities:** React component with TypeScript

`apps/web/src/components/sidebar/sidebar-toggle.tsx` (35 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<SidebarToggle>: Takes { class name }

`apps/web/src/hooks/use-mobile.tsx` (20 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<useIsMobile>: This function helps with the program's functionality
<onChange>: This function helps with the program's functionality

`apps/web/src/hooks/use-toast.ts` (2 lines)
**Main Responsibilities:** TypeScript source file

`apps/web/src/app/page.tsx` (6 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<RootPage>: This function helps with the program's functionality

`apps/web/src/app/layout.tsx` (38 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<RootLayout>: Takes { children }

`apps/web/src/app/providers.tsx` (18 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Providers>: Takes { children }

`apps/web/src/app/error.tsx` (27 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Error>: This function helps with the program's functionality
<reset>: This function helps with the program's functionality

`apps/web/src/app/not-found.tsx` (8 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<NotFound>: This function helps with the program's functionality

`apps/web/src/app/api/chat/route.ts` (78 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<POST>: This function validates input | Takes request | Returns Response.json(session)
<GET>: Takes request | Returns Response.json(sessions)
<PUT>: Takes request | Returns Response.json(session)
<DELETE>: Takes request | Ensures length > 1 | Returns NextResponse.json(result)

`apps/web/src/app/api/chat/sessions/route.ts` (67 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<GET>: This function processes sessions | Takes  request
<POST>: This function validates error instanceof z.ZodError | Takes request

`apps/web/src/app/api/chat/sessions/[sessionId]/messages/route.ts` (84 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<GET>: This function validates error instanceof z.ZodError | Takes { session id }
<POST>: This function validates error instanceof z.ZodError | Takes { session id }

`apps/web/src/app/api/actions/mcp.ts` (67 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<getMCPService>: Retrieves m c p service data | Returns mcpService
<initialize>: Creates  | This function helps with the program's functionality
<getStatus>: Retrieves status data | This function helps with the program's functionality
<getTools>: Retrieves tools data | This function helps with the program's functionality
<processMessage>: Processes message | Takes message
<shutdown>: This function helps with the program's functionality

`apps/web/src/app/api/actions/chat.ts` (179 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<createTextContent>: Helper to create a text content object
<createMessage>: Creates message | This function validates input | Takes input
<listMessages>: This function processes messagesList | Takes session id and page and limit
<deleteMessage>: Takes id and permanent
<withWriteTransaction>: Takes permanent
<restoreMessage>: Takes id

`apps/web/src/app/api/actions/chat/create-session.ts` (49 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<createChatSession>: Creates chat session | This function validates error instanceof z.ZodError and processes errors | Takes input

`apps/web/src/app/api/actions/chat/list-messages.ts` (55 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<listMessagesHandler>: This function validates input and processes messages | Takes input

`apps/web/src/app/api/actions/chat/list-sessions.ts` (42 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<listChatSessionsHandler>: This function validates input and processes sessions | Takes input

`apps/web/src/app/api/actions/chat/types.ts` (6 lines)
**Main Responsibilities:** TypeScript source file

`apps/web/src/app/api/actions/chat/delete-session.ts` (46 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<deleteChatSession>: This function validates not session and error instanceof z.ZodError and processes errors | Takes input

`apps/web/src/app/api/actions/chat/batch-operations.ts` (222 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<transformMessage>: Helper to transform DB message to API message
<batchDeleteSessionsHandler>: This function processes deleted | Takes input
<batchRestoreSessionsHandler>: Takes { ids and user.id
<batchArchiveSessionsHandler>: This function processes updated | Takes { ids and archive and user.id
<batchUpdateSessionsHandler>: Takes input
<batchDeleteMessagesHandler>: This function processes deleted | Takes input
<batchRestoreMessagesHandler>: This function processes restored | Takes { ids and user.id
<batchCreateMessagesHandler>: This function processes messages | Takes input

`apps/web/src/app/api/actions/chat/create-message.ts` (31 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<createMessageHandler>: Creates message handler | This function validates input | Takes input

`apps/web/src/app/api/actions/chat/index.ts` (20 lines)
**Main Responsibilities:** TypeScript source file

`apps/web/src/app/api/actions/chat/update-session.ts` (64 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<updateChatSession>: Updates chat session | This function validates not session | Takes input

`apps/web/src/app/chat/page.tsx` (90 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<ChatPage>: This function helps with the program's functionality

`apps/web/src/types/ws.d.ts` (73 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<callback>: This function validates input | Takes client and request **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 32)**
<callback>: Takes res and code? and message? **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 32)**

`apps/web/src/types/websocket.d.ts` (18 lines)
**Main Responsibilities:** TypeScript source file

`apps/web/src/types/env.d.ts` (14 lines)
**Main Responsibilities:** TypeScript source file

`apps/web/src/lib/utils.ts` (7 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<cn>: Takes ...inputs | Returns twMerge(clsx(inputs))

`apps/web/src/lib/errors.ts` (116 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<constructor>: Takes message **🔄 Duplicate Alert: Function appears 5 times (first occurrence: line 19)**
<constructor>: Takes message and details? **🔄 Duplicate Alert: Function appears 5 times (first occurrence: line 19)**
<constructor>: Takes message and status code and details? **🔄 Duplicate Alert: Function appears 5 times (first occurrence: line 19)**
<constructor>: Takes message and details? **🔄 Duplicate Alert: Function appears 5 times (first occurrence: line 19)**
<constructor>: Takes message and details? **🔄 Duplicate Alert: Function appears 5 times (first occurrence: line 19)**
<constructor>: Takes message and details? **🔄 Duplicate Alert: Function appears 5 times (first occurrence: line 19)**
<handleError>: Processes error | Takes error
<withErrorHandling>: This function validates error instanceof AppError and error instanceof z.ZodError and processes errors | Takes input | Returns responseSchema.parse(result)
<handler>: This function validates error instanceof AppError and error instanceof z.ZodError and processes errors | Takes input | Returns responseSchema.parse(result)
<handleDatabaseError>: Processes database error | Takes error

`apps/web/src/lib/session.ts` (195 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<generateSessionId>: Helper to generate session ID
<getCurrentTimestamp>: Helper to get current timestamp
<isSessionExpired>: Helper to check if session is expired
<createSession>: Creates session | Takes user | Returns sessionId
<getSession>: Retrieves session data | This function validates not sessionId and not session | Returns session
<endSession>: This function helps with the program's functionality
<getCurrentUser>: Retrieves current user data | Returns session.user
<withUser>: Takes user | Returns handler(user)
<handler>: Takes user | Returns handler(user) **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 117)**
<withAdmin>: Takes user | Returns handler(user)
<handler>: Takes user | Returns handler(user) **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 117)**
<checkResourceAccess>: This function helps with the program's functionality
<refreshSession>: This function helps with the program's functionality
<getUserSessions>: Retrieves user sessions data | Takes user id
<endUserSessions>: Takes user id

`apps/web/src/lib/validations/chat.ts` (36 lines)
**Main Responsibilities:** TypeScript source file

`apps/web/src/lib/services/init-chat-model.ts` (47 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<initChatModel>: Creates chat model | Takes config

`apps/web/src/lib/services/load-config.ts` (66 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<loadMCPConfig>: This function validates value and config.llm?.apiKey?.includes('${'

`apps/web/src/lib/db/transaction.ts` (149 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<wait>: Helper to wait between retries
<isRetryableError>: Helper to check if error is retryable
<executeTransaction>: Takes tx
<operation>: Takes tx **🔄 Duplicate Alert: Function appears 3 times (first occurrence: line 39)**
<withReadOnlyTransaction>: Takes tx | Returns operation(tx)
<operation>: Takes tx | Returns operation(tx) **🔄 Duplicate Alert: Function appears 3 times (first occurrence: line 39)**
<withWriteTransaction>: Takes tx | Returns operation(tx)
<operation>: Takes tx | Returns operation(tx) **🔄 Duplicate Alert: Function appears 3 times (first occurrence: line 39)**
<withBatchTransaction>: Takes tx | Returns results
<executeTransaction>: Takes const operation of operations | Returns results
<setPoolSize>: Updates pool size | Takes size
<getPoolSize>: Retrieves pool size data | Returns poolSize

`apps/web/src/lib/db/chat.ts` (335 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<getMessages>: Retrieves messages data | This function validates not session | Takes input
<createSession>: Creates session | Takes sessions | Returns result[0]
<getSessions>: Retrieves sessions data | Takes page - 1
<updateSession>: Updates session | This function validates not existingSession and input.title
<deleteSession>: This function validates not existingSession | Returns deleted
<batchDeleteSessions>: This function validates invalidSessions.length > 0 and processes existingSessions and sessionIds | Takes session ids and user id | Ensures length > 0 | Returns deleted
<batchArchiveSessions>: This function validates invalidSessions.length > 0 and processes existingSessions and sessionIds | Takes session ids and user id and archive | Ensures length > 0 | Returns updated
<createMessage>: Creates message | This function validates not session and session.deletedAt and processes content
**📄 Length Alert: File exceeds recommended length (335 lines vs. recommended 300)**

`apps/web/src/lib/stores/chat-store.ts` (200 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<addMessage>: Takes message and 'created at' | 'updated at'> **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 19)**
<sendMessage>: Takes content
<initialize>: Creates  | This function helps with the program's functionality
<createSession>: Creates session | This function helps with the program's functionality **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 22)**
<setCurrentSession>: Updates current session | Takes session id **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 23)**
<clearError>: This function helps with the program's functionality **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 24)**
<addMessage>: This function processes sessions | Takes message and 'created at' | 'updated at'> **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 19)**
<createSession>: Creates session | This function helps with the program's functionality **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 22)**
<setCurrentSession>: Updates current session | Takes session id **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 23)**
<clearError>: This function helps with the program's functionality **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 24)**

`apps/web/src/lib/stores/mcp-store.ts` (87 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<initialize>: Creates  | This function helps with the program's functionality
<processMessage>: Processes message | Takes message
<reset>: This function helps with the program's functionality **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 26)**
<reset>: This function helps with the program's functionality **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 26)**

`apps/web/app/providers.tsx` (18 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Providers>: Takes { children }

`apps/web/lib/ai/providers/anthropic.ts` (39 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<streamCompletion>: Takes error

`apps/web/lib/socket/client.ts` (74 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<constructor>: Takes private url
<connect>: This function helps with the program's functionality
<handleOpen>: Processes open | This function helps with the program's functionality
<handleMessage>: Processes message | Takes event
<handleClose>: Processes close | This function helps with the program's functionality
<handleError>: Processes error | Takes error
<attemptReconnect>: This function helps with the program's functionality
<send>: Takes data
<handler>: Takes data | Returns () => this.messageHandlers.delete(handler)
<disconnect>: This function helps with the program's functionality

`apps/web/lib/socket/server.ts` (82 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<constructor>: This function helps with the program's functionality

`packages/schema/tsup.config.ts` (12 lines)
**Main Responsibilities:** TypeScript source file

`packages/schema/eslint.config.js` (4 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`packages/schema/src/chat-batch.ts` (220 lines)
**Main Responsibilities:** TypeScript source file

`packages/schema/src/types.ts` (32 lines)
**Main Responsibilities:** TypeScript source file

`packages/schema/src/chat-session.ts` (99 lines)
**Main Responsibilities:** TypeScript source file

`packages/schema/src/metadata.ts` (122 lines)
**Main Responsibilities:** TypeScript source file

`packages/schema/src/index.ts` (63 lines)
**Main Responsibilities:** TypeScript source file

`packages/schema/src/vector.ts` (55 lines)
**Main Responsibilities:** TypeScript source file

`packages/schema/src/test-eslint.ts` (5 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<testFunction>: Returns true

`packages/schema/src/chat.ts` (77 lines)
**Main Responsibilities:** TypeScript source file

`packages/postcss-config/src/base.ts` (23 lines)
**Main Responsibilities:** TypeScript source file

`packages/postcss-config/src/index.ts` (3 lines)
**Main Responsibilities:** TypeScript source file

`packages/postcss-config/src/tailwind.ts` (16 lines)
**Main Responsibilities:** TypeScript source file

`packages/build-config/src/node-library.ts` (26 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<nodeLibraryConfig>: Takes options

`packages/build-config/src/base.ts` (27 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<baseConfig>: Takes options

`packages/build-config/src/react-library.ts` (33 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<reactLibraryConfig>: Takes options

`packages/build-config/src/index.ts` (6 lines)
**Main Responsibilities:** TypeScript source file

`packages/mcp/eslint.config.js` (4 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`packages/mcp/src/init-chat-model.ts` (59 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<initChatModel>: Creates chat model | Takes config

`packages/mcp/src/load-config.ts` (219 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<validateEnvironmentVariables>: Validates environment variables | This function validates matches not == null | Takes config
<loadConfig>: This function validates value not == undefined | Takes config path | Returns acc.replace(regex, value)
<validateConfig>: Validates config | This function validates input | Takes config
<validateLLMConfig>: Validates l l m config | Takes llm config
<validateMCPServerConfig>: Validates m c p server config | Takes server config

`packages/mcp/src/logger.ts` (103 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<constructor>: Takes { level
<createLogMethod>: Creates log method | Takes level | Returns (...args: unknown[]) => this.log(level, ...args)
<createLogger>: Creates logger | Takes options

`packages/tailwind-config/src/components.ts` (17 lines)
**Main Responsibilities:** TypeScript source file

`packages/tailwind-config/src/applications.ts` (21 lines)
**Main Responsibilities:** TypeScript source file

`packages/tailwind-config/src/base.ts` (128 lines)
**Main Responsibilities:** TypeScript source file

`packages/tailwind-config/src/index.ts` (4 lines)
**Main Responsibilities:** TypeScript source file

`packages/eslint-config/next.js` (70 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`packages/eslint-config/index.js` (11 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`packages/eslint-config/base.js` (110 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`packages/eslint-config/react-internal.js` (70 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`packages/redis/tsup.config.ts` (11 lines)
**Main Responsibilities:** TypeScript source file

`packages/redis/eslint.config.js` (4 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`packages/redis/src/env.ts` (13 lines)
**Main Responsibilities:** TypeScript source file

`packages/redis/src/client.ts` (27 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<createClient>: Creates client | This function validates input | Returns client
<createPubSubClient>: Creates pub sub client | This function helps with the program's functionality

`packages/redis/src/index.ts` (4 lines)
**Main Responsibilities:** TypeScript source file

`packages/qdrant/tsup.config.ts` (11 lines)
**Main Responsibilities:** TypeScript source file

`packages/qdrant/eslint.config.js` (4 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`packages/qdrant/src/env.ts` (13 lines)
**Main Responsibilities:** TypeScript source file

`packages/qdrant/src/client.ts` (51 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<ensureCollection>: Takes name and dimension
<upsertVectors>: Takes { collection and count and ' successfully upserted vectors'

`packages/qdrant/src/index.ts` (6 lines)
**Main Responsibilities:** TypeScript source file

`packages/logger/tsup.config.ts` (11 lines)
**Main Responsibilities:** TypeScript source file

`packages/logger/eslint.config.js` (4 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`packages/logger/src/env.ts` (13 lines)
**Main Responsibilities:** TypeScript source file

`packages/logger/src/logger.ts` (27 lines)
**Main Responsibilities:** TypeScript source file

`packages/logger/src/index.ts` (4 lines)
**Main Responsibilities:** TypeScript source file

`packages/next-config/src/base.ts` (39 lines)
**Main Responsibilities:** TypeScript source file

`packages/next-config/src/index.ts` (3 lines)
**Main Responsibilities:** TypeScript source file

`packages/next-config/src/webpack.ts` (39 lines)
**Main Responsibilities:** TypeScript source file

`packages/ui/tsup.config.ts` (18 lines)
**Main Responsibilities:** TypeScript source file

`packages/ui/tailwind.config.js` (98 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`packages/ui/eslint.config.js` (4 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`packages/ui/src/types.ts` (39 lines)
**Main Responsibilities:** TypeScript source file

`packages/ui/src/index.ts` (8 lines)
**Main Responsibilities:** TypeScript source file

`packages/ui/src/button.tsx` (21 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Button>: Takes { children and class name and app name }

`packages/ui/src/code.tsx` (12 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Code>: This function helps with the program's functionality

`packages/ui/src/card.tsx` (28 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Card>: This function helps with the program's functionality

`packages/ui/src/components/input.tsx` (26 lines)
**Main Responsibilities:** React component with TypeScript

`packages/ui/src/components/separator.tsx` (32 lines)
**Main Responsibilities:** React component with TypeScript

`packages/ui/src/components/ui/alert.tsx` (60 lines)
**Main Responsibilities:** React component with TypeScript

`packages/ui/src/components/ui/badge.tsx` (37 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Badge>: Takes { class name and variant and ...props }

`packages/ui/src/components/ui/aspect-ratio.tsx` (8 lines)
**Main Responsibilities:** React component with TypeScript

`packages/ui/src/components/ui/calendar.tsx` (65 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Calendar>: Takes "p-3" and class name
<IconLeft>: Takes { ...props }
<IconRight>: Takes { ...props }

`packages/ui/src/components/ui/avatar.tsx` (51 lines)
**Main Responsibilities:** React component with TypeScript

`packages/ui/src/components/ui/accordion.tsx` (61 lines)
**Main Responsibilities:** React component with TypeScript

`packages/ui/src/components/ui/button.tsx` (56 lines)
**Main Responsibilities:** React component with TypeScript

`packages/ui/src/hooks/use-mobile.ts` (22 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<useIsMobile>: Returns isMobile
<handleChange>: Processes change | Takes e

`packages/ui/src/hooks/use-toast.ts` (188 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<genId>: Returns count.toString()
<addToRemoveQueue>: Takes toast id
<dispatch>: Takes action
<toast>: Takes { ...props }
<update>: Updates  | Takes props
<dismiss>: This function helps with the program's functionality **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 146)**
<useToast>: This function helps with the program's functionality
<dismiss>: Takes toast id? **🔄 Duplicate Alert: Function appears 2 times (first occurrence: line 146)**

`packages/ui/src/styles/fonts.ts` (12 lines)
**Main Responsibilities:** TypeScript source file

`packages/ui/src/lib/utils.ts` (7 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<cn>: Takes ...inputs | Returns twMerge(clsx(inputs))

`packages/ui/turbo/generators/config.ts` (31 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<generator>: Takes plop

`packages/ui/@danky/ui/components/alert.tsx` (60 lines)
**Main Responsibilities:** React component with TypeScript

`packages/ui/@danky/ui/components/badge.tsx` (37 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Badge>: Takes { class name and variant and ...props }

`packages/ui/@danky/ui/components/aspect-ratio.tsx` (8 lines)
**Main Responsibilities:** React component with TypeScript

`packages/ui/@danky/ui/components/calendar.tsx` (71 lines)
**Main Responsibilities:** React component with TypeScript
**Key Functions:**
<Calendar>: Takes "p-3" and class name
<IconLeft>: Takes { class name and ...props }
<IconRight>: Takes { class name and ...props }

`packages/ui/@danky/ui/components/avatar.tsx` (51 lines)
**Main Responsibilities:** React component with TypeScript

`packages/ui/@danky/ui/components/accordion.tsx` (59 lines)
**Main Responsibilities:** React component with TypeScript

`packages/ui/@danky/ui/components/button.tsx` (57 lines)
**Main Responsibilities:** React component with TypeScript

`packages/db/tsup.config.ts` (11 lines)
**Main Responsibilities:** TypeScript source file

`packages/db/drizzle.config.ts` (14 lines)
**Main Responsibilities:** TypeScript source file

`packages/db/eslint.config.js` (4 lines)
**Main Responsibilities:** JavaScript file for client-side functionality

`packages/db/src/env.ts` (13 lines)
**Main Responsibilities:** TypeScript source file

`packages/db/src/client.ts` (38 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<transaction>: Takes callback | Returns result
<callback>: Takes db | Returns result

`packages/db/src/migrate.ts` (32 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<runMigrations>: This function helps with the program's functionality

`packages/db/src/index.ts` (5 lines)
**Main Responsibilities:** TypeScript source file

`packages/db/src/seed.ts` (75 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<main>: This function validates input

`packages/db/src/schema/vectors.ts` (47 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<createVector>: Creates vector | Takes array | Returns sql`array[${sql.join(array)}]::vector`
<vectorSimilarity>: Takes column and vector | Returns sql<number>`${column} <=> ${vector}`

`packages/db/src/schema/cache.ts` (11 lines)
**Main Responsibilities:** TypeScript source file

`packages/db/src/schema/users.ts` (26 lines)
**Main Responsibilities:** TypeScript source file

`packages/db/src/schema/index.ts` (6 lines)
**Main Responsibilities:** TypeScript source file

`packages/db/src/schema/attachments.ts` (36 lines)
**Main Responsibilities:** TypeScript source file

`packages/db/src/schema/sessions.ts` (36 lines)
**Main Responsibilities:** TypeScript source file

`packages/db/src/schema/vector.ts` (12 lines)
**Main Responsibilities:** TypeScript source file

`packages/db/src/schema/chat.ts` (32 lines)
**Main Responsibilities:** TypeScript source file

`packages/db/src/schema/auth.ts` (24 lines)
**Main Responsibilities:** TypeScript source file

`packages/db/src/migrations/0001_vector_schema.ts` (49 lines)
**Main Responsibilities:** TypeScript source file

`packages/db/src/migrations/0000_initial.ts` (107 lines)
**Main Responsibilities:** TypeScript source file
**Key Functions:**
<export>: This function helps with the program's functionality

# Project Metrics Summary
Total Files: 207
Total Lines: 9,012

**Files by Type:**
- .js: 16 files (530 lines)
- .ts: 102 files (5,305 lines)
- .tsx: 63 files (3,177 lines)

**Code Quality Alerts:**
- 🚨 Severe Length Issues: 0 files
- ⚠️ Critical Length Issues: 0 files
- 📄 Length Warnings: 2 files
- 🔄 Duplicate Functions: 25

Last updated: January 12, 2025 at 09:47 PM