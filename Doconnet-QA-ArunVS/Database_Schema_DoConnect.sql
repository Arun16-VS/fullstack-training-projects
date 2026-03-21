IF OBJECT_ID(N'[__EFMigrationsHistory]') IS NULL
BEGIN
    CREATE TABLE [__EFMigrationsHistory] (
        [MigrationId] nvarchar(150) NOT NULL,
        [ProductVersion] nvarchar(32) NOT NULL,
        CONSTRAINT [PK___EFMigrationsHistory] PRIMARY KEY ([MigrationId])
    );
END;
GO

BEGIN TRANSACTION;
CREATE TABLE [Users] (
    [UserId] int NOT NULL IDENTITY,
    [Username] nvarchar(100) NOT NULL,
    [Email] nvarchar(200) NOT NULL,
    [PasswordHash] nvarchar(max) NOT NULL,
    [Role] nvarchar(max) NOT NULL,
    [ProfilePicture] nvarchar(max) NULL,
    [Bio] nvarchar(max) NULL,
    [CreatedAt] datetime2 NOT NULL,
    [IsActive] bit NOT NULL,
    CONSTRAINT [PK_Users] PRIMARY KEY ([UserId])
);

CREATE TABLE [Questions] (
    [QuestionId] int NOT NULL IDENTITY,
    [Title] nvarchar(300) NOT NULL,
    [Body] nvarchar(max) NOT NULL,
    [Tags] nvarchar(max) NULL,
    [ViewCount] int NOT NULL,
    [VoteCount] int NOT NULL,
    [IsResolved] bit NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [UserId] int NOT NULL,
    [AcceptedAnswerId] int NULL,
    CONSTRAINT [PK_Questions] PRIMARY KEY ([QuestionId]),
    CONSTRAINT [FK_Questions_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE NO ACTION
);

CREATE TABLE [Reviews] (
    [ReviewId] int NOT NULL IDENTITY,
    [Content] nvarchar(max) NOT NULL,
    [Rating] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [IsActive] bit NOT NULL,
    [UserId] int NOT NULL,
    [ReviewedUserId] int NOT NULL,
    CONSTRAINT [PK_Reviews] PRIMARY KEY ([ReviewId]),
    CONSTRAINT [FK_Reviews_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE NO ACTION
);

CREATE TABLE [Answers] (
    [AnswerId] int NOT NULL IDENTITY,
    [Body] nvarchar(max) NOT NULL,
    [VoteCount] int NOT NULL,
    [IsAccepted] bit NOT NULL,
    [IsActive] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UpdatedAt] datetime2 NULL,
    [UserId] int NOT NULL,
    [QuestionId] int NOT NULL,
    CONSTRAINT [PK_Answers] PRIMARY KEY ([AnswerId]),
    CONSTRAINT [FK_Answers_Questions_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [Questions] ([QuestionId]) ON DELETE CASCADE,
    CONSTRAINT [FK_Answers_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE NO ACTION
);

CREATE TABLE [Notifications] (
    [NotificationId] int NOT NULL IDENTITY,
    [Message] nvarchar(max) NOT NULL,
    [Type] nvarchar(max) NOT NULL,
    [IsRead] bit NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [UserId] int NOT NULL,
    [QuestionId] int NULL,
    CONSTRAINT [PK_Notifications] PRIMARY KEY ([NotificationId]),
    CONSTRAINT [FK_Notifications_Questions_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [Questions] ([QuestionId]) ON DELETE SET NULL,
    CONSTRAINT [FK_Notifications_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE CASCADE
);

IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'Bio', N'CreatedAt', N'Email', N'IsActive', N'PasswordHash', N'ProfilePicture', N'Role', N'Username') AND [object_id] = OBJECT_ID(N'[Users]'))
    SET IDENTITY_INSERT [Users] ON;
INSERT INTO [Users] ([UserId], [Bio], [CreatedAt], [Email], [IsActive], [PasswordHash], [ProfilePicture], [Role], [Username])
VALUES (1, N'Platform Administrator', '2025-01-01T00:00:00.0000000Z', N'admin@doconnect.com', CAST(1 AS bit), N'$2a$11$Kw5oF28/TfF3jQ0c8TOeTOs9.2B3e8eFJxdLLmG6JqP45kkZLvRD.', NULL, N'Admin', N'admin');
IF EXISTS (SELECT * FROM [sys].[identity_columns] WHERE [name] IN (N'UserId', N'Bio', N'CreatedAt', N'Email', N'IsActive', N'PasswordHash', N'ProfilePicture', N'Role', N'Username') AND [object_id] = OBJECT_ID(N'[Users]'))
    SET IDENTITY_INSERT [Users] OFF;

CREATE INDEX [IX_Answers_QuestionId] ON [Answers] ([QuestionId]);

CREATE INDEX [IX_Answers_UserId] ON [Answers] ([UserId]);

CREATE INDEX [IX_Notifications_QuestionId] ON [Notifications] ([QuestionId]);

CREATE INDEX [IX_Notifications_UserId] ON [Notifications] ([UserId]);

CREATE INDEX [IX_Questions_UserId] ON [Questions] ([UserId]);

CREATE INDEX [IX_Reviews_UserId] ON [Reviews] ([UserId]);

CREATE UNIQUE INDEX [IX_Users_Email] ON [Users] ([Email]);

CREATE UNIQUE INDEX [IX_Users_Username] ON [Users] ([Username]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260315172050_InitialCreate', N'10.0.0');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Questions] ADD [ImageUrl] nvarchar(max) NULL;

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260315192123_AddQuestionImage', N'10.0.0');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [UserConnections] (
    [UserConnectionId] int NOT NULL IDENTITY,
    [FollowerId] int NOT NULL,
    [FollowingId] int NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    CONSTRAINT [PK_UserConnections] PRIMARY KEY ([UserConnectionId]),
    CONSTRAINT [FK_UserConnections_Users_FollowerId] FOREIGN KEY ([FollowerId]) REFERENCES [Users] ([UserId]) ON DELETE NO ACTION,
    CONSTRAINT [FK_UserConnections_Users_FollowingId] FOREIGN KEY ([FollowingId]) REFERENCES [Users] ([UserId]) ON DELETE NO ACTION
);

CREATE UNIQUE INDEX [IX_UserConnections_FollowerId_FollowingId] ON [UserConnections] ([FollowerId], [FollowingId]);

CREATE INDEX [IX_UserConnections_FollowingId] ON [UserConnections] ([FollowingId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260315194223_AddUserConnections', N'10.0.0');

COMMIT;
GO

BEGIN TRANSACTION;
ALTER TABLE [Questions] ADD [ApprovalStatus] nvarchar(20) NOT NULL DEFAULT N'';

ALTER TABLE [Answers] ADD [ApprovalStatus] nvarchar(20) NOT NULL DEFAULT N'';

ALTER TABLE [Answers] ADD [ImageUrl] nvarchar(max) NULL;

CREATE TABLE [Images] (
    [ImageId] int NOT NULL IDENTITY,
    [FileName] nvarchar(255) NOT NULL,
    [FilePath] nvarchar(max) NOT NULL,
    [ContentType] nvarchar(100) NOT NULL,
    [CreatedAt] datetime2 NOT NULL,
    [QuestionId] int NULL,
    [AnswerId] int NULL,
    CONSTRAINT [PK_Images] PRIMARY KEY ([ImageId]),
    CONSTRAINT [FK_Images_Answers_AnswerId] FOREIGN KEY ([AnswerId]) REFERENCES [Answers] ([AnswerId]) ON DELETE NO ACTION,
    CONSTRAINT [FK_Images_Questions_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [Questions] ([QuestionId]) ON DELETE NO ACTION
);

CREATE INDEX [IX_Images_AnswerId] ON [Images] ([AnswerId]);

CREATE INDEX [IX_Images_QuestionId] ON [Images] ([QuestionId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260320051427_AddSprint23ModerationAndImages', N'10.0.0');

COMMIT;
GO

BEGIN TRANSACTION;
CREATE TABLE [AnswerVotes] (
    [AnswerVoteId] int NOT NULL IDENTITY,
    [Value] int NOT NULL,
    [AnswerId] int NOT NULL,
    [UserId] int NOT NULL,
    CONSTRAINT [PK_AnswerVotes] PRIMARY KEY ([AnswerVoteId]),
    CONSTRAINT [FK_AnswerVotes_Answers_AnswerId] FOREIGN KEY ([AnswerId]) REFERENCES [Answers] ([AnswerId]) ON DELETE CASCADE,
    CONSTRAINT [FK_AnswerVotes_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE NO ACTION
);

CREATE TABLE [QuestionVotes] (
    [QuestionVoteId] int NOT NULL IDENTITY,
    [Value] int NOT NULL,
    [QuestionId] int NOT NULL,
    [UserId] int NOT NULL,
    CONSTRAINT [PK_QuestionVotes] PRIMARY KEY ([QuestionVoteId]),
    CONSTRAINT [FK_QuestionVotes_Questions_QuestionId] FOREIGN KEY ([QuestionId]) REFERENCES [Questions] ([QuestionId]) ON DELETE CASCADE,
    CONSTRAINT [FK_QuestionVotes_Users_UserId] FOREIGN KEY ([UserId]) REFERENCES [Users] ([UserId]) ON DELETE NO ACTION
);

CREATE UNIQUE INDEX [IX_AnswerVotes_AnswerId_UserId] ON [AnswerVotes] ([AnswerId], [UserId]);

CREATE INDEX [IX_AnswerVotes_UserId] ON [AnswerVotes] ([UserId]);

CREATE UNIQUE INDEX [IX_QuestionVotes_QuestionId_UserId] ON [QuestionVotes] ([QuestionId], [UserId]);

CREATE INDEX [IX_QuestionVotes_UserId] ON [QuestionVotes] ([UserId]);

INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES (N'20260320092606_AddPerUserVotes', N'10.0.0');

COMMIT;
GO

