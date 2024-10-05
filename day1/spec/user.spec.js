const User = require("../user");
describe("User class tests", function () {
  let user;
  beforeEach(function () {
    user = new User("kareem", "kemmo123", "sohag");
  });
  it("should create a new user", function () {
    expect(user.name).toBe("kareem");
    expect(user.password).toBe("kemmo123");
    expect(user.address).toBe("sohag");
    expect(user.cart).toEqual([]);
  });
  it("should add to cart list", function () {
    user.addToCart({ name: "iphone 15", price: 14 });
    expect(user.cart).toEqual([{ name: "iphone 15", price: 14 }]);
  });
  it("should sum price of cart list", function () {
    user.addToCart({ name: "iphone 16", price: 20 });
    user.addToCart({ name: "iphone 16", price: 20 });
    user.addToCart({ name: "iphone 16", price: 20 });
    expect(user.calculateTotalCartPrice()).toEqual(60);
  });
});
fdescribe("User class checkout tests", function () {
  let websiteUser;
  let paymentService;
  let deliveryService;

  beforeEach(function () {
    websiteUser = new User("Karim", "12345", "Cairo");

    paymentService = {
      setPaymentInfo: jasmine.createSpy("setPaymentInfo"),
      returnBack: jasmine.createSpy("returnBack"),
      isVerified: jasmine.createSpy("isVerified").and.returnValue(true), // الدفع ناجح
    };

    deliveryService = {
      shipping: jasmine.createSpy("shipping"),
    };

    websiteUser.addToCart({ name: "iphone 15", price: 14 });
  });

  it("payment should be done correctly & product shipped", function () {
    websiteUser.checkout(paymentService, deliveryService);

    expect(paymentService.setPaymentInfo).toHaveBeenCalled();
    expect(paymentService.returnBack).toHaveBeenCalled();
    expect(paymentService.isVerified).toHaveBeenCalled();

    expect(deliveryService.shipping).toHaveBeenCalledWith(
      websiteUser.address,
      websiteUser.cart
    );
  });

  it("should not call shipping if payment is not verified", function () {
    paymentService.isVerified.and.returnValue(false);

    websiteUser.checkout(paymentService, deliveryService);

    expect(paymentService.setPaymentInfo).toHaveBeenCalled();
    expect(paymentService.returnBack).toHaveBeenCalled();
    expect(paymentService.isVerified).toHaveBeenCalled();
    //FAILD if payment is not verified
    expect(deliveryService.shipping).not.toHaveBeenCalled();
  });

  // اختبار أن الشحن يتم بالبيانات الصحيحة
  it("should call shipping with correct address and cart", function () {
    websiteUser.checkout(paymentService, deliveryService);

    // التحقق من أن العنوان والسلة تم تمريرهم بشكل صحيح لدالة الشحن
    expect(deliveryService.shipping).toHaveBeenCalledWith(
      "Cairo",
      [{ name: "iphone 15", price: 14 }]
    );
  });

  // اختبار أن الدوال تستدعى بالتسلسل الصحيح
  it("should call payment methods before shipping", function () {
    websiteUser.checkout(paymentService, deliveryService);

    // التحقق من أن دوال الدفع تم استدعاؤها قبل دالة الشحن
    expect(paymentService.setPaymentInfo).toHaveBeenCalledBefore(paymentService.returnBack);
    expect(paymentService.returnBack).toHaveBeenCalledBefore(paymentService.isVerified);
    expect(paymentService.isVerified).toHaveBeenCalledBefore(deliveryService.shipping);
  });
});
