-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "agentArn" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "description" TEXT,
    "instructions" TEXT NOT NULL,
    "foundationModel" TEXT NOT NULL,
    "idleSessionTTL" INTEGER NOT NULL DEFAULT 600,
    "agentStatus" TEXT NOT NULL DEFAULT 'PREPARED',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "executionCount" INTEGER NOT NULL DEFAULT 0,
    "lastExecutionTime" DATETIME
);

-- CreateTable
CREATE TABLE "executions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "agentId" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "duration" INTEGER,
    "output" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "executions_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "agents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "executionId" TEXT NOT NULL,
    "taskName" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" DATETIME,
    "duration" INTEGER,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "output" TEXT,
    "error" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "tasks_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "executions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "execution_metrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "executionId" TEXT NOT NULL,
    "totalTasks" INTEGER NOT NULL DEFAULT 0,
    "completedTasks" INTEGER NOT NULL DEFAULT 0,
    "failedTasks" INTEGER NOT NULL DEFAULT 0,
    "runningTasks" INTEGER NOT NULL DEFAULT 0,
    "averageTaskDuration" REAL NOT NULL DEFAULT 0,
    "totalDuration" INTEGER NOT NULL DEFAULT 0,
    "throughput" REAL NOT NULL DEFAULT 0,
    "successRate" REAL NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "execution_metrics_executionId_fkey" FOREIGN KEY ("executionId") REFERENCES "executions" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "agents_agentId_key" ON "agents"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "agents_agentArn_key" ON "agents"("agentArn");

-- CreateIndex
CREATE UNIQUE INDEX "execution_metrics_executionId_key" ON "execution_metrics"("executionId");
