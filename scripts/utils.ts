import { Process } from '@yaoapps/client';

/**
 * Get the current time in milliseconds
 * @returns
 */
export function Now() {
  return new Date().getTime();
}

/**
 * Reset the demo data
 * yao run scripts.utils.ResetDemoData
 */
export function ResetDemoData() {
  Process('schemas.default.Drop', 'tests_pet'); // Drop the tests_pet table if it exists
  Process('models.tests.pet.Migrate', true); // Migrate the schema

  // Insert demo data
  ResetPets();

  // Get the records
  return Process('models.tests.pet.Get', {});
}

/**
 * Reset the administrators
 * yao run scripts.utils.ResetAdmins
 * @returns
 */
export function ResetAdmins() {
  Process('schemas.default.Drop', 'admin_user'); // Drop the users table if it exists

  Process('models.admin.user.Migrate', true); // Migrate the schema

  const admin = {
    email: 'demo@moapi.ai',
    password: 'demo@5099',
    type: 'admin'
  };
  Process('models.admin.user.Save', admin); // Save the admin

  // Get the records
  const row = Process('models.admin.user.Find', 1, { select: ['email'] });
  return { ...admin, ...row };
}

export function ResetPets() {
  return Process(
    'models.tests.pet.Insert',
    ['name', 'type', 'status', 'mode', 'stay', 'cost', 'appearance', 'images'],
    [
      [
        'Cookie',
        'cat',
        'checked',
        'enabled',
        '2023-05-15 00:00:00',
        105,
        [1],
        'https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/pet.jpg'
      ],
      [
        'Baby',
        'dog',
        'checked',
        'enabled',
        '2023-05-15 00:00:00',
        24,
        [2],
        'https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/dog.jpg'
      ],
      [
        'Poo',
        'others',
        'checked',
        'enabled',
        '2023-05-15 00:00:00',
        66,
        [3],
        'https://release-bj-1252011659.cos.ap-beijing.myqcloud.com/docs/yao-admin/pig.jpg'
      ]
    ]
  );
}
