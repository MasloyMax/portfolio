/**
 * Найти сумму всех целых чисел от start до end включительно, используя цикл.
 * Если start больше end, вернуть 0.
 * @param start - Начало диапазона, целое число.
 * @param end - Конец диапазона, целое число.
 * @returns Сумма чисел диапазона или 0, если диапазон пуст.
 */
// const sumRange = (start: number, end: number) => {
//     let sum = 0
//     if(start > end){
//         return 0
//     }
//     for(let i = start; i <= end; i++){
//         sum = sum + i
//     }
//     return sum
// }

/**
 * Найти сумму только чётных чисел массива, используя цикл.
 * Для пустого массива или массива без чётных чисел вернуть 0.
 * @param numbers - Массив чисел.
 * @returns Сумма чётных элементов или 0, если их нет.
 */
// const sumEvenNumbers = (numbers: number[]) => {
//     let sum = 0
//     if(numbers.length <= 0)return 0

//     for(let i = 0; i <= numbers.length - 1; i++){
//         if(numbers[i] % 2 != 0){
//             continue
//         }else{
//             sum = sum + numbers[i]
//         }
//     }
//     return sum
// }

/**
 * Найти максимальный элемент массива, используя цикл.
 * Учитывать отрицательные числа. Не использовать Math.max и sort.
 * @param numbers - Массив чисел, который может быть пустым.
 * @returns Максимальное число или undefined для пустого массива.
 */
// const findMax = (numbers: number[]) => {
//     let max = numbers[0]
//     if(numbers.length <= 0) return undefined

//     for(let i = 0; i < numbers.length; i++){
//         if(numbers[i] > max){
//             max = numbers[i]
//         }else{
//             continue
//         }
//     }
//     return max
// }

/**
 * Проверить, одинаково ли строка читается слева направо и справа налево.
 * Использовать цикл, не использовать reverse. Пустая строка — палиндром.
 * @param value - Строка из строчных латинских букв или пустая строка.
 * @returns true для палиндрома, иначе false.
 */
// const isPalindrome = (value: string) => {
//     if(value.length === 0) return true

//     for(let i = 0; i <= value.length - 1; i++){
//         if(value[i] === value[(value.length - 1) - i]) {
//             continue
//         }else{
//             return false
//         }
//     }
//     return true
// }

/**
 * Удалить повторяющиеся числа, сохранив порядок их первых появлений.
 * Использовать цикл, не использовать Set и не изменять входной массив.
 * Даже для пустого входного массива вернуть новый массив.
 * @param numbers - Массив чисел, в котором могут быть повторы.
 * @returns Новый массив уникальных чисел в исходном порядке.
 */
// const removeDuplicates = (numbers: number[]) => {
//     if(numbers.length == 0){
//         return []
//     }

//     let newArr: number[] = []
//     newArr.push(numbers[0])
//     for(let i = 1; i <= numbers.length - 1 ; i++){
//         if(newArr.includes(numbers[i])){
//             continue    
//         }
//         newArr.push(numbers[i])
//     }
//     return newArr
// }

/**
 * Подсчитать количество вхождений каждого символа строки, используя цикл.
 * Порядок ключей в результате не важен. Для пустой строки вернуть {}.
 * @param value - Строка из строчных латинских букв или пустая строка.
 * @returns Объект, в котором ключ — символ, а значение — число его вхождений.
 */
// function countChars(value: string): Record<string, number> {
//     if (value.length === 0) return {}
//     let valueArray = value.split('')
//     const counts: Record<string, number> = {}

//     for (let i = 0; i < valueArray.length; i++) {
//         counts[valueArray[i]] = 0
//     }
//     for (let item in valueArray) {
//         counts[valueArray[item]]++
//     }
//     return counts
// }


/**
 * Подсчитать количество вхождений каждого символа строки, используя цикл.
 * Порядок ключей в результате не важен. Для пустой строки вернуть {}.
 * @param value - Строка из строчных латинских букв или пустая строка.
 * @returns Объект, в котором ключ — символ, а значение — число его вхождений.
 */
function countChars(value: string): Record<string, number> {
    if (value.length === 0) return {}
    const counts: Record<string, number> = {}

    for (const char of value) {
        if (!counts[char]) {
            counts[char] = 1
        } else {
            counts[char]++
        }
    }
    return counts
}


/**
 * Проверить, состоят ли две строки из одинаковых букв с одинаковыми частотами.
 * Порядок букв может отличаться. Не использовать сортировку.
 * Две пустые строки считать анаграммами. Можно использовать countChars.
 * @param first - Первая строка из строчных латинских букв или пустая строка.
 * @param second - Вторая строка из строчных латинских букв или пустая строка.
 * @returns true, если строки являются анаграммами, иначе false.
 */
// const areAnagrams = (first: string, second: string): boolean => {
//     const firstCounts: Record<string, number> = countChars(first)
//     const secondCounts: Record<string, number> = countChars(second)

//     if (first.length == second.length) {
//         for (const firstChar in firstCounts) {
//             if (firstCounts[firstChar] == secondCounts[firstChar]) {
//                 continue
//             } else return false
//         }
//     }else return false
//     return true
// }

/**
 * Найти два элемента с разными индексами, сумма которых равна target.
 * Вернуть индексы любой подходящей пары в любом порядке.
 * Одинаковые значения на разных позициях допустимы. Не изменять входной массив.
 * @param numbers - Массив чисел, который может содержать повторы или быть пустым.
 * @param target - Искомая сумма двух элементов.
 * @returns Пара индексов или undefined, если подходящей пары нет.
 */
// const twoSum = (numbers: number[], target: number): [number, number] | undefined => {
//     for (let i = 0; i < numbers.length; i++) {
//         for (let j = i + 1; j < numbers.length; j++) {
//             if (numbers[i] + numbers[j] === target) {
//                 return [i, j]
//             }
//         }
//     }
//     return undefined
// }

/**
 * Найти первый по порядку символ строки, который встречается ровно один раз.
 * Вернуть сам символ, а не его индекс. Можно использовать countChars.
 * @param value - Строка из строчных латинских букв или пустая строка.
 * @returns Первый неповторяющийся символ или undefined, если такого символа нет.
 */
// function firstUniqueChar(value: string): string | undefined {
//     const firstCounts: Record<string, number> = countChars(first)
//     for(let i = 0; i <= value.length -1; i++){

//         let count = 0
//         for(const item of value){
//             if(value[i] == item){
//                 count++
//             }
//         }
//         if(count == 1){
//             return value[i]
//         }
//     }
//     return undefined
// }

/**
 * Найти первый по порядку символ строки, который встречается ровно один раз.
 * Решить за O(n), без вложенных циклов. Можно использовать countChars.
 * @param value - Строка из строчных латинских букв или пустая строка.
 * @returns Первый неповторяющийся символ или undefined, если такого символа нет.
 */
// function firstUniqueChar(value: string): string | undefined {
//     const firstCounts: Record<string, number> = countChars(value)
//     for (let i = 0; i <= value.length - 1; i++) {
//         if(firstCounts[value[i]] === 1 ) return value[i]
//     }
//     return undefined
// }

/**
 * Проверить правильность скобочной последовательности.
 * Каждая открывающая скобка должна закрываться скобкой того же типа
 * с соблюдением вложенности. Пустую строку считать корректной.
 * @param value - Строка только из символов (, ), [, ], {, } или пустая строка.
 * @returns true, если все скобки правильно закрыты, иначе false.
 */
// function isValidBrackets(value: string): boolean {
//     const stack: string[] = []
//     for (let i = 0; i < value.length; i++) {
//         if (value[i] == '(' || value[i] == '[' || value[i] == '{') {
//             stack.push(value[i])
//         } else {
//             const last = stack.pop()
//             if (value[i] === ")" && last !== "(" || value[i] === "]" && last != "[" || value[i] === '}' && last !== '{') {
//                 return false
//             }
//         }
//     }
//     return stack.length === 0
// }

/**
 * Проверить правильность скобочной последовательности за O(n).
 * Каждая открывающая скобка должна закрываться скобкой того же типа
 * с соблюдением вложенности. Пустую строку считать корректной.
 * Для упрощения проверки пар использовать объект соответствий.
 * @param value - Строка только из символов (, ), [, ], {, } или пустая строка.
 * @returns true, если все скобки правильно закрыты, иначе false.
 */
// function isValidBrackets(value: string): boolean {
//     const stack: string[] = []
//     const pairs: Record<string, string> = {
//                 ")": "(",
//                 "]": "[",
//                 "}": "{"
//             }

//     for (let i = 0; i < value.length; i++) {
//         if (value[i] == '(' || value[i] == '[' || value[i] == '{') {
//             stack.push(value[i])
//         } else {
//             const last = stack.pop()

//             if(last !== pairs[value[i]]){
//                 return false
//             }

//         }
//     }
//     return stack.length === 0
// }
// console.log(isValidBrackets("()[]{}"))

// function mergeSortedArrays(first: number[], second: number[]): number[] {
//     let resultArray: number[] = []
//     let i = 0
//     let j = 0

//     while (i < first.length && j < second.length) {
//         if (first[i] < second[j]) {
//             resultArray.push(first[i])
//             i++
//         } else {
//             resultArray.push(second[j])
//             j++
//         }
//     }
//     while(i < first.length){
//         resultArray.push(first[i])
//         i++
//     }
//     while(j < second.length){
//         resultArray.push(second[j])
//         j++
//     }
//     return resultArray
// }

function mergeSortedArrays(first: number[], second: number[]): number[] {
    let resultArray: number[] = []
    let i = 0
    let j = 0

    while (i < first.length || j < second.length) {
        if (first[i] < second[j]) {
            resultArray.push(first[i])
            i++
        } else if (i >= first.length) {
            resultArray.push(first[i])
            i++
        } else if (j >= second.length) {
            resultArray.push(second[j])
            j++
        } else {
            resultArray.push(second[j])
            j++
        }
    }
    return resultArray
}