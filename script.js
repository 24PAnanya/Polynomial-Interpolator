// script.js
function interpolatePolynomial() {
    
    const q = parseInt(document.getElementById('q').value);
    const degree = parseInt(document.getElementById('degree').value);
    console.log(q); 
    console.log("hello");
    const xInput = document.getElementById('xpoints').value;
    const yInput = document.getElementById('ypoints').value;
    const xArray = xInput.split(',').map(value => parseInt(value.trim()));
    const yArray = yInput.split(',').map(value => parseInt(value.trim()));
    // Validate input
    if (isNaN(q) || isNaN(degree) ) {
      console.error('Invalid input. Please enter valid numbers.');
      return;
    }
    console.log(xArray);
    console.log(yArray);
    // Implement Lagrange interpolation
    const interpolatedPolynomial = lagrangeInterpolation(q, degree, xArray,yArray);
  
    // Output or display the interpolated polynomial
    console.log('Interpolated polynomial:', interpolatedPolynomial);


    // Define the steps as a formatted string
    const step_s = `
    <p><strong>Input:</strong> Receive input parameters:</p>
    <ul>
        <li><strong>q:</strong> a prime number representing the finite field.</li>
        <li><strong>degree:</strong> the degree of the polynomial to be interpolated.</li>
        <li><strong>xArray:</strong> an array of x-coordinates of known data points.</li>
        <li><strong>yArray:</strong> an array of y-coordinates of known data points.</li>
    </ul>
    <p><strong>Calculate Inverses:</strong> Calculate the multiplicative inverse for every number in the finite field Fq.</p>
    <p><strong>Initialize Selector Polynomial Array:</strong> Initialize an array to store the selector polynomials for each data point.</p>
    <p><strong>Loop Through Data Points:</strong> For each data point:</p>
    <ul>
        <li>Calculate the selector polynomial using Lagrange basis polynomials.</li>
        <li>Store the selector polynomial in the array.</li>
    </ul>
    <p><strong>Combine Selector Polynomials:</strong> Combine the selector polynomials to get the final polynomial.</p>
    <p><strong>Format and Display Output:</strong> Format the final polynomial expression. Display the final polynomial expression and selector polynomials.</p>
    `;

    // Set the innerHTML of a div element to the formatted steps
    document.getElementById("step_s").innerHTML = step_s;

  }

  function polynomial_mul(polyA,polyB,q){
    let n = polyA.length+polyB.length-1;
    let arr = new Array(n).fill(0);
    for(let i=0;i<polyA.length;++i){
        for(let j=0;j<polyB.length;++j){
            arr[i+j] += (polyA[i]*polyB[j])%q;
        }
    }
    return arr;
  }

  function multiplicativeInverse(a, q) {
    for (let i = 1; i < q; i++) {
        if ((a * i) % q === 1) {
            return i;
        }
    }
    // If no inverse exists, return null
    return null;
  }

    // Function to calculate inverse for every number in Fq
    function calculateInverseForField(q) {
        const inverses = [];
        inverses.push(0);
        for (let a = 1; a < q; a++) {
            const inverse = multiplicativeInverse(a, q);
            inverses.push(inverse);
        }
        return inverses;
    }

  
  // Implement Lagrange interpolation algorithm
  function lagrangeInterpolation(q, degree, xArray,yArray) {
    let n = xArray.length;
    var selector_polynomial = [];
    var inverse_list = calculateInverseForField(q);
    let stepsContent = "";
    for(let i=0;i<n;++i){
        let denom = 1;
        let poly=[1];
        for(let j=0;j<n;++j){
            if(i!=j){
                console.log(i);
                coeff_list = [-xArray[j],1];                
                poly = polynomial_mul(coeff_list,poly,q);                
                denom*=(xArray[i]-xArray[j])%q;
            }
        }       
        denom = (denom%q+q)%q;
        console.log(inverse_list[denom]);
        console.log(poly);
        poly = polynomial_mul([inverse_list[denom]],poly,q);
        console.log(poly);
        poly = polynomial_mul([yArray[i]],poly,q);
        console.log(poly);
        selector_polynomial.push(poly);
        stepsContent += `Step ${i + 1}: Selector polynomial for point ${i}: ${poly}<br>`;
    }

    polyAdd = selector_polynomial[0].slice(); 
    for (let i = 1; i < selector_polynomial.length; ++i) {
        for (let j = 0; j < polyAdd.length; ++j) {
            polyAdd[j] = (polyAdd[j] + selector_polynomial[i][j]) % q;
        }
    }

    for (let i = 0; i < polyAdd.length; ++i) {
        polyAdd[i] = (polyAdd[i] + q) % q;
    }

    console.log(polyAdd);

    printexp(selector_polynomial,polyAdd,xArray,yArray,n);
    
  }


  function printSelectorPolynomial(selector_polynomial) {
    let stepsContent = "Selector polynomial: ";
    for (let i = 0; i < selector_polynomial.length; i++) {
        stepsContent += `${selector_polynomial[i]} `;
    }
    stepsContent += "<br>";

    for (let i = 0; i < selector_polynomial.length; i++) {
        let polynomial = "";
        for (let j = selector_polynomial[i].length - 1; j >= 0; j--) {
            if (selector_polynomial[i][j] !== 0) {
                let term = `${selector_polynomial[i][j] !== 1 ? selector_polynomial[i][j] : ''}x${j > 0 ? `<sup>${j}</sup>` : ''}`;
                polynomial += (selector_polynomial[i][j] > 0 ? '+' : '') + term + ' ';
            }
        }
        stepsContent += `l_${i} = ${polynomial}; [${selector_polynomial[i]}]<br>`;
    }
    document.getElementById("stepsContent").innerHTML = stepsContent;
  }


  function printexp(selector_polynomial,polyAdd,xArray,yArray,n){

    printSelectorPolynomial(selector_polynomial);
    let polynomialExpression = "f(x) = ";
    for (let i = polyAdd.length - 1; i >= 0; i--) {
            polynomialExpression += `${polyAdd[i]}x<sup>${i}</sup> `;
            if (i !== 0 && polyAdd[i - 1] >= 0) {
                polynomialExpression += "+ ";
            }
    }
    document.getElementById("Exp").style.display = "block";
    document.getElementById("polynomialExp").innerHTML = polynomialExpression;

    let exp = "";
    let m = polyAdd.length;
    for(let i=0;i<m;++i){
        let a = polyAdd[i].toString();
        let b = (i).toString();
        if(i!=m-1){
        exp+=`${a}*Math.pow(x,${b})+`;
        }
        else{
            exp+=`${a}*Math.pow(x,${b})`;
        }
    }
// Generate values
    const xValues = [];
    const yValues = [];
    for (let x = -10; x <= 10; x += 0.1) {
    xValues.push(x);
    yValues.push(eval(exp));
    }

    // Display using Plotly
    const data = [{x:xValues, y:yValues, mode:"lines"}];
    const layout = {title: "y = " + exp};
    Plotly.newPlot("myPlot", data);
  }
  