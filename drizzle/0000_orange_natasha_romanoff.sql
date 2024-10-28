CREATE TABLE IF NOT EXISTS "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT NOW(),
	CONSTRAINT "projects_id_unique" UNIQUE("id"),
	CONSTRAINT "slug_unique_index" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "steps" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(150) NOT NULL,
	"api" varchar(150) NOT NULL,
	"workflow_id" integer NOT NULL,
	"wf_version_id" integer NOT NULL,
	"validate" json DEFAULT '{}'::json,
	"on_success" json DEFAULT '{"next":"complete"}'::json,
	"on_failure" json DEFAULT '{"next":"error"}'::json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT NOW(),
	CONSTRAINT "steps_id_unique" UNIQUE("id"),
	CONSTRAINT "workflowIdVersionIdSlugUniqueIndex" UNIQUE("workflow_id","wf_version_id","slug")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "wf_versions" (
	"id" serial PRIMARY KEY NOT NULL,
	"workflow_id" integer NOT NULL,
	"version" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT NOW(),
	CONSTRAINT "wf_versions_id_unique" UNIQUE("id"),
	CONSTRAINT "workflowIdVersionUniqueIndex" UNIQUE("workflow_id","version")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "workflows" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" varchar(150) NOT NULL,
	"project_id" integer NOT NULL,
	"description" varchar(255) NOT NULL,
	"metadata" json DEFAULT '{}'::json,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT NOW(),
	CONSTRAINT "workflows_id_unique" UNIQUE("id"),
	CONSTRAINT "projectVersionSlugUniqueIndex" UNIQUE("project_id","slug")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "steps" ADD CONSTRAINT "steps_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "steps" ADD CONSTRAINT "steps_wf_version_id_wf_versions_id_fk" FOREIGN KEY ("wf_version_id") REFERENCES "public"."wf_versions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "wf_versions" ADD CONSTRAINT "wf_versions_workflow_id_workflows_id_fk" FOREIGN KEY ("workflow_id") REFERENCES "public"."workflows"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "workflows" ADD CONSTRAINT "workflows_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
