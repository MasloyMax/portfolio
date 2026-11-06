class Test {
    /**
     * Найти сумму только чётных чисел массива, используя цикл.
     * Не изменять входной массив.
     * Для пустого массива или массива без чётных чисел вернуть 0.
     * 
     * @param numbers массив целых чисел; null не передаётся
     * @return сумма чётных элементов или 0, если их нет
     */
    public static int sumEvenNumbers(int[] numbers) {
        int sum = 0;
        for (int i = 0; i < numbers.length; i++) {
            if (numbers[i] % 2 == 0) {
                sum += numbers[i];
            }
        }
        return sum;
    }

    public static  Integer findMax (int[] numbers){
        int sum = 0;
        if(numbers.length == 0){
            return null;
        }
        for(int i; i < numbers.length; i++){
            if(numbers[i] > numbers[i + 1]){
                sum = i;
            }
        }
        return sum;
    }

    public static void main(String[] args) {
        System.out.println(sumEvenNumbers(new int[] { 1, 2, 3, 4 })); // Ожидается: 6
        System.out.println(sumEvenNumbers(new int[] { -4, -3, 0, 2 })); // Ожидается: -2
        System.out.println(sumEvenNumbers(new int[] { 1, 3, 5 })); // Ожидается: 0
        System.out.println(sumEvenNumbers(new int[] {})); // Ожидается: 0
    }
}
