export const ActivationFunctions = {
    sigmoid: {
        function: (z: number) => 1 / (1 + Math.pow(Math.E, -z)),
        diffFunction: (z: number) =>
            ActivationFunctions.sigmoid.function(z) *
            (1 - ActivationFunctions.sigmoid.function(z)),
    },
};
