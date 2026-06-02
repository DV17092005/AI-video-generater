const generateScript =
require(
 "../../../AI Engine/text-to-script/generateScript"
);

test(
 "creates story",
 async () => {

  const result =
   await generateScript(
    "Lion Story"
   );

  expect(
   result.title
  ).toBeDefined();
 }
);
