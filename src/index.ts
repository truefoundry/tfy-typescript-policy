import * as policy from './policy';



const policyObject = {
    validate: (policy as any).validate,
    mutate: (policy as any).mutate,
};
// Make it available on the global scope
(globalThis as any).policy = policyObject;
export default policyObject;

