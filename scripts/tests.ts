import { LoadOption, MigrateOption, Process } from "@yao/runtime";
import { Now, ResetAdmins, ResetDemoData, ResetPets } from "@scripts/utils"; // Import Now function from scripts/utils.ts.

/**
 * Custom process demo
 * yao run scripts.tests.Hello "Hello, World!"
 * @param input string the input string
 * @returns string
 */
function Hello(input: string): string {
  console.log(`Hello process is executed with input: ${input}, now: ${Now()}`);
  return input;
}

/**
 * Executed after the application setup ( Setup Wizard )
 * yao run scripts.tests.AppSetup
 */
function AppSetup() {
  Reset();
}

/**
 * Executed after the application load ( yao start or yao run )
 * @param option LoadOption
 */
function AppAfterLoad(option: LoadOption) {}

/**
 * Executed after the application migrate ( yao migrate )
 * @param option MigrateOption
 */
function AppAfterMigrate(option: MigrateOption) {}

/**
 * Reset the demo data
 * yao run scripts.tests.Reset
 */
function Reset() {
  ResetDemoData(); // Reset the demo data
  ResetAdmins(); // Reset the admins data
}
